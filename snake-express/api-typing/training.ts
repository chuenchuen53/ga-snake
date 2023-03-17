import type { evolveRequestSchema, initModelRequestSchema, toggleBackupPopulationWhenFinishRequestSchema } from "./zod/training";
import type { z } from "zod";
import type { EvolveResult, ExportedGaModel } from "snake-ai/GaModel";

export type InitModelRequest = z.infer<typeof initModelRequestSchema>;

export interface InitModelResponse {
  id: string;
}

export type EvolveRequest = z.infer<typeof evolveRequestSchema>;

export type ToggleBackupPopulationRequest = z.infer<typeof toggleBackupPopulationWhenFinishRequestSchema>;

export type GetCurrentModelInfoResponse = Omit<Omit<ExportedGaModel, "parentModelId">, "population"> & {
  id: string;
  evolveResultHistory: EvolveResult[];
  populationHistory: { generation: number }[];
};
