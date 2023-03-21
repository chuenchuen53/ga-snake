import mongoose, { Schema } from "mongoose";
import { Individual } from "./Individual";
import type { InferSchemaType } from "mongoose";
import type { IndividualPlainObject } from "snake-ai/GaModel";

export const populationSchema = new Schema(
  {
    generation: { type: Number, required: true },
    population: { type: [Schema.Types.ObjectId], required: true, ref: "Individual" },
  },
  {
    timestamps: true,
    statics: {
      async insertNewPopulation(data: { generation: number; population: IndividualPlainObject[] }) {
        const insertedIndividuals = await Individual.insertMany(data.population);
        const ids = insertedIndividuals.map((x) => x._id);
        return await this.create({
          generation: data.generation,
          population: ids,
        });
      },
    },
  }
);

export const Population = mongoose.model("Population", populationSchema);
export type PopulationDocument = InferSchemaType<typeof Population>;
