import type { toggleBackupModelRequestSchema, evolveRequestSchema } from "../training-zod";
import type { z } from "zod";
import type { EvolveResult, ExportedGaModel, Options } from "snake-ai/GaModel";

export interface InitModelRequest {
  options: Options;
}

export interface InitModelResponse {
  id: string;
}

export type EvolveRequest = z.infer<typeof evolveRequestSchema>;

export type ToggleBackupModelRequest = z.infer<typeof toggleBackupModelRequestSchema>;

export type GetCurrentModelInfoResponse = Omit<ExportedGaModel, "parentModelId"> & {
  id: string;
  evolveResult: EvolveResult[];
};
