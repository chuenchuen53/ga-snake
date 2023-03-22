import type { evolveRequestSchema, initModelRequestSchema, toggleBackupPopulationWhenFinishRequestSchema } from "./zod/training";
import type { z } from "zod";
import type { EvolveResult, IGaModel } from "snake-ai/GaModel";

export type InitModelRequest = z.infer<typeof initModelRequestSchema>;

export type EvolveRequest = z.infer<typeof evolveRequestSchema>;

export type toggleBackupPopulationWhenFinishRequest = z.infer<typeof toggleBackupPopulationWhenFinishRequestSchema>;

export interface EvolveResultWithId extends EvolveResult {
  _id: string;
}

export interface PopulationHistory {
  _id: string;
  generation: number;
}

export type GetCurrentModelInfoResponse = Omit<Omit<IGaModel, "parentModelId">, "population"> & {
  _id: string;
  evolveResultHistory: EvolveResultWithId[];
  populationHistory: PopulationHistory[];
};

export type InitModelResponse = GetCurrentModelInfoResponse;

export interface PollingInfoResponse {
  newEvolveResultHistory: EvolveResultWithId[];
  newPopulationHistory: PopulationHistory[];
  backupPopulationInProgress: boolean;
  backupPopulationWhenFinish: boolean;
  evolving: boolean;
}
