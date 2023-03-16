import mongoose, { Schema } from "mongoose";
import { ActivationFunction } from "snake-ai/CalcUtils";
import { individualSchema } from "./Individual";
import type { InferSchemaType, ObjectId } from "mongoose";
import type { ExportedGaModel } from "snake-ai/GaModel";

export type IGaModel = Omit<ExportedGaModel, "parentModelId"> & {
  parentModelId?: ObjectId;
  evolveResult: ObjectId[];
};

export const gaModelSchema = new Schema<IGaModel>({
  parentModelId: Schema.Types.ObjectId,
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
  population: { type: [individualSchema], required: true },
  evolveResult: { type: [Schema.Types.ObjectId], required: true },
});

export const GaModel = mongoose.model("GaModel", gaModelSchema);
export type GaModelDocument = InferSchemaType<typeof gaModelSchema>;
