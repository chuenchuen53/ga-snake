import mongoose, { Schema } from "mongoose";
import { individualSchema } from "./Individual";
import type { EvolveResult as IEvolveResult } from "snake-ai/GaModel";
import type { InferSchemaType } from "mongoose";

export const evolveResultSchema = new Schema<IEvolveResult>({
  generation: { type: Number, required: true },
  bestIndividual: { type: individualSchema, required: true },
  timeSpent: { type: Number, required: true },
});

export const EvolveResult = mongoose.model("EvolveResult", evolveResultSchema);
export type EvolveResultDocument = InferSchemaType<typeof evolveResultSchema>;
