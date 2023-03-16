import { Schema } from "mongoose";
import { ActivationFunction } from "snake-ai/CalcUtils";
import { Direction } from "snake-game/typing";
import type { ISnakeBrain } from "snake-ai/SnakeBrain";
import type { IPosition } from "snake-game/Position";
import type { IndividualPlainObject } from "snake-ai/GaModel";
import type { GameRecord, MoveRecordRow } from "snake-game/SnakeGame";

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

export const moveRecordRowSchema = new Schema<MoveRecordRow>(
  {
    move: { type: Number, required: true },
    fx: { type: Number, required: false },
    fy: { type: Number, required: false },
  },
  { _id: false }
);

export const gameRecordSchema = new Schema<GameRecord>(
  {
    initialSnakePosition: { type: positionSchema, required: true },
    initialSnakeDirection: { type: String, enum: Direction, required: true },
    initialFoodPosition: { type: positionSchema, required: true },
    moveRecord: { type: [moveRecordRowSchema], required: true },
  },
  { _id: false }
);

export const individualSchema = new Schema<IndividualPlainObject>(
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
