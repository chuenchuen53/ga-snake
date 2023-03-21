import { describe } from "node:test";
import { Direction } from "snake-game/typing";
import mongoose from "mongoose";
import { ActivationFunction } from "snake-ai/CalcUtils";
import { embeddedIndividualSchema, gameRecordSchema, moveRecordRowSchema, positionSchema, snakeBrainSchema } from "../mongo/Individual";
import type { IPosition } from "snake-game/Position";
import type { GameRecord, MoveRecordRow } from "snake-game/SnakeGame";
import type { ISnakeBrain } from "snake-ai/SnakeBrain";
import type { IndividualPlainObject } from "snake-ai/GaModel";

describe("check Individual", () => {
  it("snakeBrainSchema", () => {
    const model = mongoose.model("tempTestSnakeBrain", snakeBrainSchema);

    const snakeBrain1: ISnakeBrain = {
      inputLength: 0,
      layerShapes: [
        [2, 2],
        [3, 4],
      ],
      hiddenLayerActivationFunction: ActivationFunction.RELU,
      weights: [
        [
          [1, 2],
          [3, 4],
        ],
        [
          [5, 6, 7, 8],
          [9, 10, 11, 12],
          [13, 14, 15, 16],
        ],
      ],
      biases: [
        [1, 2],
        [3, 4, 5, 6],
      ],
    };
    const snakeBrain2 = new model(snakeBrain1);
    expect(snakeBrain2.toObject()).toStrictEqual(snakeBrain1);
  });

  it("check PositionSchema", () => {
    const model = mongoose.model("tempTestPosition", positionSchema);

    const position1: IPosition = { x: 0, y: 0 };
    const position2 = new model(position1);
    expect(position2.toObject()).toStrictEqual(position1);
  });

  it("check MoveRecordRowSchema", () => {
    const model = mongoose.model("tempTestMoveRecordRow", moveRecordRowSchema);

    const moveRecordRow1: MoveRecordRow = { move: 0, fx: 0, fy: 0 };
    const moveRecordRow2 = new model(moveRecordRow1);
    expect(moveRecordRow2.toObject()).toStrictEqual(moveRecordRow1);

    const moveRecordRow3: MoveRecordRow = { move: 1 };
    const moveRecordRow4 = new model(moveRecordRow3);
    expect(moveRecordRow4.toObject()).toStrictEqual(moveRecordRow3);
  });

  it("check GameRecordSchema", () => {
    const model = mongoose.model("tempTestGameRecord", gameRecordSchema);
    const gameRecord1: GameRecord = {
      initialSnakePosition: { x: 0, y: 0 },
      initialSnakeDirection: Direction.UP,
      initialFoodPosition: { x: 0, y: 0 },
      moveRecord: [{ move: 0, fx: 0, fy: 0 }, { move: 1 }],
    };
    const gameRecord2 = new model(gameRecord1);
    expect(gameRecord2.toObject()).toStrictEqual(gameRecord1);
  });

  it("check IndividualSchema", () => {
    const model = mongoose.model("tempTestIndividual", embeddedIndividualSchema);

    const individual1: IndividualPlainObject = {
      snakeBrain: {
        inputLength: 0,
        layerShapes: [
          [2, 2],
          [3, 4],
        ],
        hiddenLayerActivationFunction: ActivationFunction.RELU,
        weights: [
          [
            [1, 2],
            [3, 4],
          ],
          [
            [5, 6, 7, 8],
            [9, 10, 11, 12],
            [13, 14, 15, 16],
          ],
        ],
        biases: [
          [1, 2],
          [3, 4, 5, 6],
        ],
      },
      snakeLength: 0,
      moves: 0,
      fitness: 0,
      survive: false,
      gameRecord: {
        initialSnakePosition: { x: 0, y: 0 },
        initialSnakeDirection: Direction.UP,
        initialFoodPosition: { x: 0, y: 0 },
        moveRecord: [{ move: 0 }],
      },
    };
    const individual2 = new model(individual1);
    expect(individual2.toObject()).toStrictEqual(individual1);
  });
});
