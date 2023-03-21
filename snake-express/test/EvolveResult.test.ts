import { describe } from "node:test";
import { Direction } from "snake-game/typing";
import mongoose from "mongoose";
import { ActivationFunction } from "snake-ai/CalcUtils";
import { evolveResultSchema } from "../mongo/EvolveResult";
import type { EvolveResult } from "snake-ai/GaModel";

describe("check evolveResultSchema", () => {
  it("evolveResultSchema", () => {
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
      },
      timeSpent: 10,
      overallStats: {
        fitness: {
          min: 0,
          max: 1,
          mean: 2,
          sd: 3,
          lowerQuartile: 4,
          median: 5,
          upperQuartile: 6,
          skewness: 7,
          kurtosis: 8,
        },
        snakeLength: {
          min: 10,
          max: 11,
          mean: 12,
          sd: 13,
          lowerQuartile: 14,
          median: 15,
          upperQuartile: 16,
          skewness: 17,
          kurtosis: 18,
        },
        moves: {
          min: 20,
          max: 21,
          mean: 22,
          sd: 23,
          lowerQuartile: 24,
          median: 25,
          upperQuartile: 26,
          skewness: 27,
          kurtosis: 28,
        },
      },
    };

    const evolveResult2 = new model(evolveResult1);
    const { _id, ...objWithoutId } = evolveResult2.toObject();
    expect(objWithoutId).toStrictEqual(evolveResult1);
  });
});
