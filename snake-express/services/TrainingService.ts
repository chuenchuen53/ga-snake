import GaModel from "snake-ai/GaModel";
import { AppDb } from "../mongo";
import type { Types } from "mongoose";
import type { EvolveResult as IEvolveResult } from "snake-ai/GaModel";
import type { GetCurrentModelInfoResponse, InitModelRequest } from "../api-typing/training";
import type { IGaModel } from "../mongo/GaModel";

export default class TrainingService {
  private db = AppDb.getInstance();
  private _gaModel: GaModel | null = null;
  private _queueTraining = 0;
  private _backupPopulationInProgress = false;
  private backupPopulationWhenFinish = false;
  private currentModelId: null | Types.ObjectId = null;

  public get gaModel(): GaModel | null {
    return this._gaModel;
  }

  public get queueTraining(): number {
    return this._queueTraining;
  }

  public get backupPopulationInProgress(): boolean {
    return this._backupPopulationInProgress;
  }

  public async initModel(options: InitModelRequest["options"]): Promise<string> {
    this._gaModel = new GaModel(options);

    const { population: _, ...modelData } = this._gaModel.exportModel();

    const gaModelDoc = new this.db.GaModel<IGaModel>({
      ...modelData,
      populationHistory: [],
      evolveResultHistory: [],
    });
    const { _id } = await gaModelDoc.save();
    this.currentModelId = _id;
    await this.backupCurrentPopulation();

    return this.currentModelId.toString();
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
    const insertResult = await this.db.Population.insertNewPopulation({
      generation: exportModel.generation,
      population: exportModel.population,
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const gaModelDoc = (await this.db.GaModel.findById(this.currentModelId))!;
    gaModelDoc.populationHistory.push(insertResult._id);
    await gaModelDoc.save();
    this._backupPopulationInProgress = false;
    return true;
  }

  public async getCurrentModelInfo(): Promise<GetCurrentModelInfoResponse> {
    if (!this.currentModelId) throw new Error("model not exists");
    const model = await this.db.GaModel.findById(this.currentModelId)
      .populate<{ evolveResultHistory: IEvolveResult[] }>("evolveResultHistory")
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
    }
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

      if (this._queueTraining > 0) {
        setImmediate(() => this.startTraining());
      } else if (this._queueTraining === 0 && this.backupPopulationWhenFinish) {
        await this.backupCurrentPopulation();
      }
    }
  }
}
