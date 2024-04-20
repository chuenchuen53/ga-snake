import mongoose, { Schema } from "mongoose";
import { ActivationFunction } from "snake-ai/CalcUtils";
import type { InferSchemaType, Types } from "mongoose";
import type { IGaModel as TsIGaModel } from "snake-ai/GaModel";

export type IGaModel = Omit<TsIGaModel, "population"> & {
  populationHistory: Types.ObjectId[];
  evolveResultHistory: Types.ObjectId[];
};

export const gaModelSchema = new Schema<IGaModel>(
  {
    worldWidth: { type: Number, required: true },
    worldHeight: { type: Number, required: true },
    hiddenLayersLength: { type: [Number], required: true },
    hiddenLayerActivationFunction: { type: String, enum: ActivationFunction, required: true },
    populationSize: { type: Number, required: true },
    surviveRate: { type: Number, required: true },
    populationMutationRate: { type: Number, required: true },
    geneMutationRate: { type: Number, required: true },
    mutationAmount: { type: Number, required: true },
    trialTimes: { type: Number, required: true },
    generation: { type: Number, required: true },
    populationHistory: { type: [Schema.Types.ObjectId], required: true, ref: "Population" },
    evolveResultHistory: { type: [Schema.Types.ObjectId], required: true, ref: "EvolveResult" },
  },
  { timestamps: true }
);

export const GaModel = mongoose.model("GaModel", gaModelSchema);
export type GaModelDocument = InferSchemaType<typeof gaModelSchema>;
