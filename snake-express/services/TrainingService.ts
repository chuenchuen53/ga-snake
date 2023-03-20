import GaModel from "snake-ai/GaModel";
import { AppDb } from "../mongo";
import type { EvolveResult } from "snake-ai/GaModel";
import type { EventEmitter } from "events";
import type { Types } from "mongoose";
import type { EvolveResultWithId, GetCurrentModelInfoResponse, InitModelRequest, PollingInfoResponse } from "../api-typing/training";
import type { IGaModel } from "../mongo/GaModel";

export default class TrainingService {
  public static currentModelId = "";

  private db = AppDb.getInstance();
  private _gaModel: GaModel | null = null;
  private _queueTraining = 0;
  private _backupPopulationInProgress = false;
  private backupPopulationWhenFinish = false;
  private currentModelId: null | Types.ObjectId = null;
  private evolveResultHistoryCache: EvolveResultWithId[] = [];
  private populationHistoryCache: { _id: string; generation: number }[] = [];
  private emitters: EventEmitter[] = [];

  public get gaModel(): GaModel | null {
    return this._gaModel;
  }

  public get queueTraining(): number {
    return this._queueTraining;
  }

  public get backupPopulationInProgress(): boolean {
    return this._backupPopulationInProgress;
  }

  public addEmitter(emitter: EventEmitter): void {
    this.emitters.push(emitter);
  }

  public removeEmitter(emitter: EventEmitter): void {
    this.emitters = this.emitters.filter((e) => e !== emitter);
  }

  public async initModel(options: InitModelRequest["options"]): Promise<GetCurrentModelInfoResponse> {
    this._gaModel = new GaModel(options);

    const { population: _, ...modelData } = this._gaModel.exportModel();

    const gaModelDoc = new this.db.GaModel<IGaModel>({
      ...modelData,
      populationHistory: [],
      evolveResultHistory: [],
    });
    const { _id } = await gaModelDoc.save();
    this.currentModelId = _id;
    TrainingService.currentModelId = _id.toString();
    await this.backupCurrentPopulation();

    return await this.getCurrentModelInfo();
  }

  public evolve(times: number): void {
    if (!this._gaModel) throw new Error("model not exists");
    if (this.queueTraining || this._gaModel.evolving) throw new Error("training already started");
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
  public async backupCurrentPopulation(): Promise<boolean> {
    if (!this._gaModel) throw new Error("model not exists");
    if (this._backupPopulationInProgress) throw new Error("previous backup still in progress");
    if (this.gaModel?.evolving) throw new Error("model is evolving"); // population will change during evolving

    const exportModel = this._gaModel.exportModel();

    const record = await this.db.GaModel.findById(this.currentModelId).select("populationHistory").populate<{ populationHistory: { generation: number }[] }>("populationHistory", "generation");
    if (!record) throw new Error("model not exists");

    const { populationHistory } = record;
    if (populationHistory.length) {
      const lastPopulation = populationHistory[populationHistory.length - 1];
      if (lastPopulation.generation === exportModel.generation) return false;
    }

    this._backupPopulationInProgress = true;
    this.emitters.forEach((emitter) => emitter.emit("change"));

    const insertResult = await this.db.Population.insertNewPopulation({
      generation: exportModel.generation,
      population: exportModel.population,
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const gaModelDoc = (await this.db.GaModel.findById(this.currentModelId))!;
    gaModelDoc.populationHistory.push(insertResult._id);
    await gaModelDoc.save();

    if (exportModel.generation !== -1) {
      this.populationHistoryCache.push({ _id: insertResult._id.toString(), generation: exportModel.generation });
      this.emitters.forEach((emitter) => emitter.emit("change"));
    }
    this._backupPopulationInProgress = false;
    return true;
  }

  public async getCurrentModelInfo(): Promise<GetCurrentModelInfoResponse> {
    if (!this.currentModelId) throw new Error("model not exists");
    const model = await this.db.GaModel.findById(this.currentModelId)
      .populate<{ evolveResultHistory: EvolveResult[] }>("evolveResultHistory")
      .populate<{ populationHistory: { generation: number }[] }>("populationHistory", "generation")
      .exec();
    if (!model) throw new Error("model not exists");
    return model.toObject();
  }

  public async removeCurrentModel(): Promise<void> {
    if (this._gaModel) {
      await this._gaModel.destroy();
      this.currentModelId = null;
      this._gaModel = null;
      this._queueTraining = 0;
      this._backupPopulationInProgress = false;
      this.evolveResultHistoryCache = [];
      this.populationHistoryCache = [];
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
    if (!this._gaModel) throw new Error("model not exists");
    const haveNewEvolveResultHistory = (this.evolveResultHistoryCache[this.evolveResultHistoryCache.length - 1]?.generation ?? -1) > evolvingResultHistoryGeneration;
    const haveNewPopulationHistory = (this.populationHistoryCache[this.populationHistoryCache.length - 1]?.generation ?? -1) > populationHistoryGeneration;
    const backupPopulationInProgressMatch = this._backupPopulationInProgress === backupPopulationInProgress;
    const backupPopulationWhenFinishMatch = this.backupPopulationWhenFinish === backupPopulationWhenFinish;
    const evolvingMatch = Boolean(this.queueTraining || this._gaModel.evolving) === evolving;
    return !haveNewEvolveResultHistory && !haveNewPopulationHistory && backupPopulationInProgressMatch && backupPopulationWhenFinishMatch && evolvingMatch;
  }

  public pollingInfo({
    currentEvolvingResultHistoryGeneration,
    currentPopulationHistoryGeneration,
  }: {
    currentEvolvingResultHistoryGeneration: number;
    currentPopulationHistoryGeneration: number;
  }): PollingInfoResponse {
    if (!this._gaModel) throw new Error("model not exists");

    const newEvolveResultHistory = this.evolveResultHistoryCache.filter((x) => x.generation > currentEvolvingResultHistoryGeneration);
    const newPopulationHistory = this.populationHistoryCache.filter((x) => x.generation > currentPopulationHistoryGeneration);

    return {
      newEvolveResultHistory,
      newPopulationHistory,
      backupPopulationInProgress: this._backupPopulationInProgress,
      backupPopulationWhenFinish: this.backupPopulationWhenFinish,
      evolving: Boolean(this.queueTraining || this._gaModel.evolving),
    };
  }

  private async startTraining(): Promise<void> {
    if (this._gaModel && this._queueTraining > 0) {
      const evolveResult = await this._gaModel.evolve();
      if (this._queueTraining > 0) this._queueTraining--;
      const evolveResultDoc = new this.db.EvolveResult(evolveResult);
      const evolveResultInsertResult = await evolveResultDoc.save();
      const evolveResultId = evolveResultInsertResult._id;
      const model = await this.db.GaModel.findById(this.currentModelId);
      if (!model) throw new Error("model not exists");
      model.generation = evolveResult.generation;
      model.evolveResultHistory.push(evolveResultId);
      await model.save();
      this.evolveResultHistoryCache.push({ ...evolveResult, _id: evolveResultId.toString() });
      this.emitters.forEach((emitter) => emitter.emit("change"));

      if (this._queueTraining > 0) {
        setImmediate(() => this.startTraining());
      } else if (this._queueTraining === 0 && this.backupPopulationWhenFinish) {
        await this.backupCurrentPopulation();
      }
    }
  }
}
