import type { evolveRequestSchema, initModelRequestSchema, toggleBackupPopulationRequestSchema } from "./zod/training";
import type { z } from "zod";
import type { EvolveResult, ExportedGaModel } from "snake-ai/GaModel";

export type InitModelRequest = z.infer<typeof initModelRequestSchema>;

export interface InitModelResponse {
  id: string;
}

export type EvolveRequest = z.infer<typeof evolveRequestSchema>;

export type ToggleBackupPopulationRequest = z.infer<typeof toggleBackupPopulationRequestSchema>;

export type GetCurrentModelInfoResponse = Omit<Omit<ExportedGaModel, "parentModelId">, "population"> & {
  id: string;
  evolveResult: EvolveResult[];
};
