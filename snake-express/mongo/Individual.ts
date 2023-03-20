import mongoose, { Schema } from "mongoose";
import { ActivationFunction } from "snake-ai/CalcUtils";
import { Direction } from "snake-game/typing";
import type { InferSchemaType } from "mongoose";
import type { ISnakeBrain } from "snake-ai/SnakeBrain";
import type { IPosition } from "snake-game/Position";
import type { IndividualPlainObject } from "snake-ai/GaModel";
import type { GameRecord } from "snake-game/SnakeGame";

export const snakeBrainSchema = new Schema<ISnakeBrain>(
  {
    inputLength: { type: Number, required: true },
    layerShapes: { type: [[Number]], required: true },
    hiddenLayerActivationFunction: { type: String, enum: ActivationFunction, required: true },
    weightArr: { type: [[[Number]]], required: true },
    biasesArr: { type: [[Number]], required: true },
  },
  { _id: false }
);

export const positionSchema = new Schema<IPosition>(
  {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  { _id: false }
);

export const gameRecordSchema = new Schema<GameRecord>(
  {
    worldWidth: { type: Number, required: true },
    worldHeight: { type: Number, required: true },
    initialSnakePosition: { type: positionSchema, required: true },
    initialSnakeDirection: { type: String, enum: Direction, required: true },
    initialFoodPosition: { type: positionSchema, required: true },
    moveRecord: { type: [Number], required: true },
  },
  { _id: false }
);

export const embeddedIndividualSchema = new Schema<IndividualPlainObject>(
  {
    snakeBrain: { type: snakeBrainSchema, required: true },
    snakeLength: { type: Number, required: true },
    moves: { type: Number, required: true },
    fitness: { type: Number, required: true },
    survive: { type: Boolean, required: true },
    gameRecord: { type: gameRecordSchema, default: null },
  },
  { _id: false }
);

export const individualSchema = new Schema<IndividualPlainObject>({
  snakeBrain: { type: snakeBrainSchema, required: true },
  snakeLength: { type: Number, required: true },
  moves: { type: Number, required: true },
  fitness: { type: Number, required: true },
  survive: { type: Boolean, required: true },
  gameRecord: { type: gameRecordSchema, default: null },
});

export const Individual = mongoose.model("Individual", individualSchema);
export type IndividualDocument = InferSchemaType<typeof Individual>;
