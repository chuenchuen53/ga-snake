import type { EvolveResult } from "snake-ai/GaModel";
import type { IGaModel } from "../mongo/GaModel";

export interface TrainedModel {
  _id: string;
  createdAt: Date;
  generation: number;
  bestSnakeLength: number | null;
  bestMoves: number | null;
  snakeLengthMean: number | null;
  movesMean: number | null;
}

export interface GetAllTrainedModelsResponse {
  models: TrainedModel[];
}

export interface EvolveResultWithId extends EvolveResult {
  _id: string;
}

export interface PopulationHistory {
  _id: string;
  generation: number;
}

export type GetModelDetailResponse = Omit<IGaModel, "population"> & {
  _id: string;
  evolveResultHistory: EvolveResultWithId[];
  populationHistory: PopulationHistory[];
};
