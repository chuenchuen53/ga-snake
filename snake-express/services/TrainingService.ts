import GaModel from "snake-ai/GaModel";
import { AppDb } from "../mongo";
import type { EvolveResult as IEvolveResult } from "snake-ai/GaModel";
import type { Types } from "mongoose";
import type { GetCurrentModelInfoResponse, InitModelRequest } from "../api-typing/training";
import type { IGaModel } from "../mongo/GaModel";
import type { IDbPopulation } from "../mongo/Population";

export default class TrainingService {
  private db = AppDb.getInstance();
  private _gaModel: GaModel | null = null;
  private _currentModelId: null | Types.ObjectId = null;
  private _queueTrainingTime = 0;
  private _backupPopulation = false;

  public get gaModel(): GaModel | null {
    return this._gaModel;
  }

  public get queueTrainingTime(): number {
    return this._queueTrainingTime;
  }

  public async initModel(options: InitModelRequest["options"]): Promise<string> {
    console.log("start init model");
    this._gaModel = new GaModel(options);

    const exportModel = this._gaModel.exportModel();

    const populationData: IDbPopulation = {
      generation: exportModel.generation,
      population: exportModel.population,
    };
    console.log("start creating population doc");
    const populationDoc = new this.db.Population(populationData);
    console.log("start save population to db");
    const populationInsertResult = await populationDoc.save();

    console.log("start save ga model to db");
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
      populationHistory: [populationInsertResult._id],
      evolveResultHistory: [],
    };

    console.log("start creating ga model doc");
    const gaModelDoc = new this.db.GaModel(gaModelData);
    console.log("start save ga model to db");
    const { _id } = await gaModelDoc.save();
    this._currentModelId = _id;
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
    console.log("--------------------");
    console.log("Stop evolve");
    console.log("--------------------");
    return;
  }

  public toggleBackupPopulation(backup: boolean): void {
    this._backupPopulation = backup;
    console.log("--------------------");
    console.log("Toggle backup population", backup);
    console.log("--------------------");
    return;
  }

  public async getCurrentModelInfo(): Promise<GetCurrentModelInfoResponse> {
    if (!this._currentModelId) throw new Error("model not exists");
    const model = await this.db.GaModel.findById(this._currentModelId).populate("evolveResultHistory").populate("populationHistory", "generation").exec();
    if (!model) throw new Error("model not exists");
    // todo
    return model as any;
  }

  private async startTraining(): Promise<void> {
    if (this._gaModel && this._queueTrainingTime > 0) {
      const evolveResult: IEvolveResult = await this._gaModel.evolve();
      if (this._queueTrainingTime > 0) this._queueTrainingTime--;
      const evolveResultDoc = new this.db.EvolveResult(evolveResult);
      const evolveResultPromise = evolveResultDoc.save();
      if (this._backupPopulation) {
        const exportModel = this._gaModel.exportModel();
        const populationData: IDbPopulation = {
          generation: exportModel.generation,
          population: exportModel.population,
        };
        const populationDoc = new this.db.Population(populationData);
        const populationPromise = populationDoc.save();
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
