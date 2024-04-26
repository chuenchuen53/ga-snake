import events from "events";
import { Worker } from "worker_threads";
import path from "path";
import { AppDb } from "../../mongo";
import AppEnv from "../../AppEnv";
import { WorkerAction } from "./typing";
import type { EvolveResult, IGaModel, IndividualPlainObject, Options } from "snake-ai/GaModel";
import type { IGaModel as IGaModelDb } from "../../mongo/GaModel";
import type { WorkerMessage, WorkerResponse, GetPopulationResponse } from "./typing";
import type { PopulationHistory, EvolveResultWithId, InitModelRequest, PollingInfoResponse, ModelInfo } from "../../api-typing/training";
import type { Types } from "mongoose";

const WORKER_PATH = path.resolve(__dirname, "./worker.js");

export default class TrainingService {
  public static currentModelId = "";

  public emitter = new events.EventEmitter();

  private db = AppDb.getInstance();
  private _queueTraining = 0;
  private _backupPopulationInProgress = false;
  private _currentModelId: null | Types.ObjectId = null;
  private backupPopulationWhenFinish = false;
  private evolveResultHistoryCache: EvolveResultWithId[] = [];
  private populationHistoryCache: PopulationHistory[] = [];
  private worker: Worker = new Worker(WORKER_PATH);
  private modelEvolving = false;

  public get queueTraining(): number {
    return this._queueTraining;
  }

  public get backupPopulationInProgress(): boolean {
    return this._backupPopulationInProgress;
  }

  get currentModelId(): Types.ObjectId | null {
    return this._currentModelId;
  }

  public publishChange(): void {
    this.emitter.emit("change");
  }

  public async initModel(options: InitModelRequest["options"]): Promise<void> {
    this.worker.postMessage({
      action: WorkerAction.NEW_MODEL,
      payload: {
        options,
        numOfThreads: AppEnv.NUM_OF_THREADS,
      },
    } satisfies WorkerMessage);

    const promise = new Promise<IGaModel>((resolve, reject) => {
      this.worker.once("message", (message: WorkerResponse) => {
        if (message.action === WorkerAction.NEW_MODEL) {
          if ("errMessage" in message) {
            reject(new Error(message.errMessage));
            return;
          }
          resolve(message.response.gaModel);
        }
      });
    });
    const gaModel = await promise;

    const { population: _, ...modelData } = gaModel;

    const gaModelDoc = new this.db.GaModel<IGaModelDb>({
      ...modelData,
      populationHistory: [],
      evolveResultHistory: [],
    });
    const { _id } = await gaModelDoc.save();
    this._currentModelId = _id;
    TrainingService.currentModelId = _id.toString();
  }

  public async resumeModel(modelId: string, generation: number): Promise<void> {
    const gaModel = await this.db.GaModel.findOne({ _id: modelId })
      .populate<{ populationHistory: { generation: number; population: IndividualPlainObject[] }[] }>({
        path: "populationHistory",
        match: { generation },
        populate: {
          path: "population",
          model: "Individual",
        },
      })
      .exec();

    if (!gaModel) throw new Error("model not found");

    const populationHistory = gaModel.populationHistory[0];
    if (!populationHistory) throw new Error("population not found");

    const snakeBrains = populationHistory.population.map((x) => x.snakeBrain);

    let options: Options = {
      worldWidth: gaModel.worldWidth,
      worldHeight: gaModel.worldHeight,
      snakeBrainConfig: {
        hiddenLayersLength: gaModel.hiddenLayersLength.map((x) => x as number),
        hiddenLayerActivationFunction: gaModel.hiddenLayerActivationFunction,
      },
      gaConfig: {
        populationSize: gaModel.populationSize,
        surviveRate: gaModel.surviveRate,
        populationMutationRate: gaModel.populationMutationRate,
        geneMutationRate: gaModel.geneMutationRate,
        mutationAmount: gaModel.mutationAmount,
        trialTimes: gaModel.trialTimes,
      },
      providedInfo: {
        generation,
        snakeBrains,
      },
    };

    // worker cannot clone options, so we need to stringify and parse it
    options = JSON.parse(JSON.stringify(options));

    await this.initModel(options);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- checked before
    const parentModelEvolveResultHistory = (await this.db.GaModel.findById(modelId).select("evolveResultHistory"))!;

    const evolveResultIds = [];
    for (const evolveResultId of parentModelEvolveResultHistory.evolveResultHistory) {
      // Remove the _id so that a new document with a unique _id is inserted into MongoDB
      const evolveResult = await this.db.EvolveResult.findById(evolveResultId, { _id: 0 });
      if (evolveResult && evolveResult.generation <= generation) {
        const clonedEvolveResult = evolveResult.toObject();
        if (evolveResult.id) throw new Error("evolveResult.id should not exists");
        const newEvolveResult = await this.db.EvolveResult.create(clonedEvolveResult);
        evolveResultIds.push(newEvolveResult._id);
        this.evolveResultHistoryCache.push({ ...clonedEvolveResult, _id: newEvolveResult._id.toString() });
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- currentModel is inserted before
    const currentModel = (await this.db.GaModel.findById(this._currentModelId))!;
    currentModel.evolveResultHistory = evolveResultIds;
    await currentModel.save();
  }

  public evolve(times: number): void {
    if (!this._currentModelId) throw new Error("model does not exists");
    if (this.queueTraining) throw new Error("training already started");
    this._queueTraining = times;
    setImmediate(() => this.startTraining());
  }

  public stopEvolve(): void {
    this._queueTraining = 0;
  }

  public toggleBackupPopulationWhenFinish(backup: boolean): void {
    this.backupPopulationWhenFinish = backup;
  }

  /**
   * @returns true if backup success, false if backup is already exists
   * */
  public async backupCurrentPopulation(skipQueueTrainingCheck = false): Promise<boolean> {
    if (!this._currentModelId) throw new Error("model does not exists");
    if (this._backupPopulationInProgress) throw new Error("previous backup still in progress");
    if (!skipQueueTrainingCheck && this._queueTraining) throw new Error("model is evolving"); // population will change during evolving

    this.worker.postMessage({
      action: WorkerAction.GET_POPULATION,
    } satisfies WorkerMessage);

    const promise = new Promise<GetPopulationResponse["response"]>((resolve, reject) => {
      this.worker.once("message", (message: WorkerResponse) => {
        if (message.action === WorkerAction.GET_POPULATION) {
          if ("errMessage" in message) {
            reject(new Error(message.errMessage));
            return;
          }
          resolve(message.response);
        }
      });
    });
    const data = await promise;

    if (data.generation === -1) {
      throw new Error("model generation is -1, has not evolved yet");
    }

    const record = await this.db.GaModel.findById(this._currentModelId).select("populationHistory").populate<{ populationHistory: { generation: number }[] }>("populationHistory", "generation");
    if (!record) throw new Error("model does not exists");

    const { populationHistory } = record;
    if (populationHistory.length) {
      const lastPopulation = populationHistory[populationHistory.length - 1];
      if (lastPopulation.generation === data.generation) return false;
    }

    this._backupPopulationInProgress = true;

    this.publishChange();

    const insertResult = await this.db.Population.insertNewPopulation({
      generation: data.generation,
      population: data.population,
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const gaModelDoc = (await this.db.GaModel.findById(this._currentModelId))!;
    gaModelDoc.populationHistory.push(insertResult._id);
    await gaModelDoc.save();

    this.populationHistoryCache.push({ _id: insertResult._id.toString(), generation: data.generation });
    this.publishChange();

    this._backupPopulationInProgress = false;
    return true;
  }

  public async getCurrentModelInfo(): Promise<ModelInfo> {
    if (!this._currentModelId) throw new Error("model does not exists");
    const model = await this.db.GaModel.findById(this._currentModelId)
      .populate<{ evolveResultHistory: EvolveResult[] }>("evolveResultHistory")
      .populate<{ populationHistory: PopulationHistory[] }>("populationHistory", "generation")
      .exec();
    if (!model) throw new Error("model does not exists");
    return model.toObject();
  }

  public async removeCurrentModel(): Promise<void> {
    if (this._currentModelId) {
      this.worker.postMessage({
        action: WorkerAction.REMOVE_MODEL,
      } satisfies WorkerMessage);
      const promise = new Promise<void>((resolve) => {
        this.worker.once("message", (message: WorkerResponse) => {
          if (message.action === WorkerAction.REMOVE_MODEL) {
            resolve();
          }
        });
      });
      await promise;

      this._currentModelId = null;
      this._queueTraining = 0;
      this._backupPopulationInProgress = false;
      this.evolveResultHistoryCache = [];
      this.populationHistoryCache = [];

      TrainingService.currentModelId = "";
    }
  }

  public stateMatch({
    evolvingResultHistoryGeneration,
    populationHistoryGeneration,
    backupPopulationInProgress,
    backupPopulationWhenFinish,
    evolving,
  }: {
    evolvingResultHistoryGeneration: number;
    populationHistoryGeneration: number;
    backupPopulationInProgress: boolean;
    backupPopulationWhenFinish: boolean;
    evolving: boolean;
  }): boolean {
    if (!this._currentModelId) throw new Error("model does not exists");
    const haveNewEvolveResultHistory = (this.evolveResultHistoryCache[this.evolveResultHistoryCache.length - 1]?.generation ?? -1) > evolvingResultHistoryGeneration;
    const haveNewPopulationHistory = (this.populationHistoryCache[this.populationHistoryCache.length - 1]?.generation ?? -1) > populationHistoryGeneration;
    const backupPopulationInProgressMatch = this._backupPopulationInProgress === backupPopulationInProgress;
    const backupPopulationWhenFinishMatch = this.backupPopulationWhenFinish === backupPopulationWhenFinish;
    const evolvingMatch = (Boolean(this.queueTraining) || this.modelEvolving) === evolving;
    return !haveNewEvolveResultHistory && !haveNewPopulationHistory && backupPopulationInProgressMatch && backupPopulationWhenFinishMatch && evolvingMatch;
  }

  public pollingInfo({
    currentEvolvingResultHistoryGeneration,
    currentPopulationHistoryGeneration,
  }: {
    currentEvolvingResultHistoryGeneration: number;
    currentPopulationHistoryGeneration: number;
  }): PollingInfoResponse {
    if (!this._currentModelId) throw new Error("model does not exists");

    const newEvolveResultHistory = this.evolveResultHistoryCache.filter((x) => x.generation > currentEvolvingResultHistoryGeneration);
    const newPopulationHistory = this.populationHistoryCache.filter((x) => x.generation > currentPopulationHistoryGeneration);

    return {
      newEvolveResultHistory,
      newPopulationHistory,
      backupPopulationInProgress: this._backupPopulationInProgress,
      backupPopulationWhenFinish: this.backupPopulationWhenFinish,
      evolving: Boolean(this.queueTraining) || this.modelEvolving,
    };
  }

  private async startTraining(): Promise<void> {
    if (this._currentModelId && this._queueTraining > 0) {
      this.worker.postMessage({
        action: WorkerAction.EVOLVE,
      });

      this.modelEvolving = true;

      try {
        const promise = new Promise<EvolveResult>((resolve, reject) => {
          this.worker.once("message", (message: WorkerResponse) => {
            if (message.action === WorkerAction.EVOLVE) {
              if ("errMessage" in message) {
                reject(new Error(message.errMessage));
                return;
              }
              resolve(message.response.evolveResult);
            }
          });
        });
        const evolveResult = await promise;

        this.modelEvolving = false;
        if (this._queueTraining > 0) this._queueTraining--;
        const evolveResultDoc = new this.db.EvolveResult(evolveResult);
        const evolveResultInsertResult = await evolveResultDoc.save();
        const evolveResultId = evolveResultInsertResult._id;
        const model = await this.db.GaModel.findById(this._currentModelId);
        if (!model) throw new Error("model does not exists");
        model.generation = evolveResult.generation;
        model.evolveResultHistory.push(evolveResultId);
        await model.save();
        this.evolveResultHistoryCache.push({ ...evolveResult, _id: evolveResultId.toString() });
        this.publishChange();

        if (this._queueTraining > 0) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- gameRecord is not null after evolve
          const maxScore = this.evolveResultHistoryCache[0].bestIndividual.gameRecord!.worldWidth * this.evolveResultHistoryCache[0].bestIndividual.gameRecord!.worldHeight;
          // auto backup population if first time reach max length
          if (this.evolveResultHistoryCache.findIndex((x) => x.bestIndividual.snakeLength === maxScore) === this.evolveResultHistoryCache.length - 1) {
            await this.backupCurrentPopulation(true);
          }

          setImmediate(() => this.startTraining());
        } else if (this._queueTraining === 0 && this.backupPopulationWhenFinish) {
          await this.backupCurrentPopulation();
        }
      } catch (e) {
        this.modelEvolving = false;
        console.error(e);
      }
    }
  }
}
