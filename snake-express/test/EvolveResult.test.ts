import { describe } from "node:test";
import { Direction } from "snake-game/typing";
import mongoose from "mongoose";
import { ActivationFunction } from "snake-ai/CalcUtils";
import { evolveResultSchema } from "../mongo/EvolveResult";
import type { EvolveResult } from "snake-ai/GaModel";

describe("check evolveResultSchema", () => {
  test("evolveResultSchema", () => {
    const model = mongoose.model("tempTestEvolveResultSchema", evolveResultSchema);

    const evolveResult1: EvolveResult = {
      generation: 2,
      bestIndividual: {
        snakeBrain: {
          inputLength: 0,
          layerShapes: [
            [2, 2],
            [3, 4],
          ],
          hiddenLayerActivationFunction: ActivationFunction.RELU,
          weightArr: [
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
          biasesArr: [
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
      },
      timeSpent: 10,
    };

    const evolveResult2 = new model(evolveResult1);
    const { _id, ...objWithoutId } = evolveResult2.toObject();
    expect(objWithoutId).toStrictEqual(evolveResult1);
  });
});
