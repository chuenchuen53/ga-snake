import mongoose, { Schema } from "mongoose";
import { individualSchema } from "./Individual";
import type { InferSchemaType } from "mongoose";
import type { EvolveResult as IEvolveResult } from "snake-ai/GaModel";
import type { BaseStats } from "snake-ai/CalcUtils";

const baseStatsSchema = new Schema<BaseStats>(
  {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    mean: { type: Number, required: true },
    sd: { type: Number, required: true },
    lowerQuartile: { type: Number, required: true },
    median: { type: Number, required: true },
    upperQuartile: { type: Number, required: true },
  },
  { _id: false }
);

export const evolveResultSchema = new Schema<IEvolveResult>({
  generation: { type: Number, required: true },
  bestIndividual: { type: individualSchema, required: true },
  timeSpent: { type: Number, required: true },
  overallStats: {
    fitness: { type: baseStatsSchema, required: true },
    snakeLength: { type: baseStatsSchema, required: true },
    moves: { type: baseStatsSchema, required: true },
  },
});

export const EvolveResult = mongoose.model("EvolveResult", evolveResultSchema);
export type EvolveResultDocument = InferSchemaType<typeof evolveResultSchema>;
