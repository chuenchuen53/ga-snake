import mongoose, { Schema } from "mongoose";
import { individualSchema } from "./Individual";
import type { InferSchemaType } from "mongoose";
import type { IndividualPlainObject } from "snake-ai/GaModel";

export interface IDbPopulation {
  generation: number;
  population: IndividualPlainObject[];
}

export const populationSchema = new Schema<IDbPopulation>({
  generation: { type: Number, required: true },
  population: { type: [individualSchema], required: true },
});

export const Population = mongoose.model("Population", populationSchema);
export type PopulationDocument = InferSchemaType<typeof Population>;
