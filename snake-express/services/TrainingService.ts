import GaModel from "snake-ai/GaModel";
import { AppDb } from "../mongo";
import type { Types } from "mongoose";
import type { EvolveResult as IEvolveResult } from "snake-ai/GaModel";
import type { GetCurrentModelInfoResponse, InitModelRequest } from "../api-typing/training";
import type { IGaModel } from "../mongo/GaModel";

export default class TrainingService {
  private db = AppDb.getInstance();
  private _gaModel: GaModel | null = null;
  private _currentModelId: null | Types.ObjectId = null;
  private _queueTrainingTime = 0;
  private _backupPopulationInProgress = false;

  public get gaModel(): GaModel | null {
    return this._gaModel;
  }

  public get queueTrainingTime(): number {
    return this._queueTrainingTime;
  }

  public async initModel(options: InitModelRequest["options"]): Promise<string> {
    this._gaModel = new GaModel(options);

    const exportModel = this._gaModel.exportModel();

    const gaModelData: IGaModel = {
      worldWidth: exportModel.worldWidth,
      worldHeight: exportModel.worldHeight,
      hiddenLayersLength: exportModel.hiddenLayersLength,
      hiddenLayerActivationFunction: exportModel.hiddenLayerActivationFunction,
      populationSize: exportModel.populationSize,
      surviveRate: exportModel.surviveRate,
      populationMutationRate: exportModel.populationMutationRate,
      geneMutationRate: exportModel.geneMutationRate,
      mutationAmount: exportModel.mutationAmount,
      trialTimes: exportModel.trialTimes,
      generation: exportModel.generation,
      populationHistory: [],
      evolveResultHistory: [],
    };

    const gaModelDoc = new this.db.GaModel(gaModelData);
    const { _id } = await gaModelDoc.save();
    this._currentModelId = _id;
    await this.backupCurrentPopulation();
    return _id.toString();
  }

  public async evolve(times: number): Promise<void> {
    if (!this._gaModel) throw new Error("model not exists");
    if (this.queueTrainingTime) throw new Error("training already started");
    this._queueTrainingTime = times;
    this.startTraining();
    return;
  }

  public stopEvolve(): void {
    this._queueTrainingTime = 0;
    return;
  }

  public async backupCurrentPopulation(): Promise<void> {
    if (this._backupPopulationInProgress) throw new Error("previous backup still in progress");

    if (!this._gaModel) throw new Error("model not exists");
    const exportModel = this._gaModel.exportModel();

    // check if the population is already in the database
    const gaModel = await this.db.GaModel.findById(this._currentModelId).populate("populationHistory", "generation").exec();
    if (!gaModel) throw new Error("model not exists");
    // check if have population history
    if (gaModel.populationHistory.length) {
      // check if the generation is the same for the last record
      const lastPopulation = gaModel.populationHistory[gaModel.populationHistory.length - 1];
      // todo
      if ((lastPopulation as any).generation === exportModel.generation) {
        throw new Error("population already backup");
      }
    }

    this._backupPopulationInProgress = true;
    const insertResult = await this.db.Population.insertNewPopulation({
      generation: exportModel.generation,
      population: exportModel.population,
    });

    gaModel.populationHistory.push(insertResult._id);
    await gaModel.save();
    this._backupPopulationInProgress = false;
    return;
  }

  public async getCurrentModelInfo(): Promise<GetCurrentModelInfoResponse> {
    if (!this._currentModelId) throw new Error("model not exists");
    const model = await this.db.GaModel.findById(this._currentModelId).populate("evolveResultHistory").populate("populationHistory", "generation").exec();
    if (!model) throw new Error("model not exists");
    return model as any;
  }

  private async startTraining(): Promise<void> {
    if (this._gaModel && this._queueTrainingTime > 0) {
      const evolveResult: IEvolveResult = await this._gaModel.evolve();
      if (this._queueTrainingTime > 0) this._queueTrainingTime--;
      const evolveResultDoc = new this.db.EvolveResult(evolveResult);
      const evolveResultPromise = evolveResultDoc.save();
      if (this._backupPopulationInProgress) {
        const exportModel = this._gaModel.exportModel();
        const populationPromise = this.db.Population.insertNewPopulation({
          generation: exportModel.generation,
          population: exportModel.population,
        });
        const [evolveResultInsertResult, populationInsertResult] = await Promise.all([evolveResultPromise, populationPromise]);
        const evolveResultId = evolveResultInsertResult._id;
        const populationId = populationInsertResult._id;
        const model = await this.db.GaModel.findById(this._currentModelId);
        if (!model) throw new Error("model not exists");
        model.generation = exportModel.generation;
        model.populationHistory.push(populationId);
        model.evolveResultHistory.push(evolveResultId);
        await model.save();
      } else {
        const evolveResultInsertResult = await evolveResultPromise;
        const evolveResultId = evolveResultInsertResult._id;
        const model = await this.db.GaModel.findById(this._currentModelId);
        if (!model) throw new Error("model not exists");
        model.generation = evolveResult.generation;
        model.evolveResultHistory.push(evolveResultId);
        await model.save();
      }
      if (this._queueTrainingTime > 0) this.startTraining();
    }
  }
}
