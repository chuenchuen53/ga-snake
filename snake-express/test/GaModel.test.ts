import { describe } from "node:test";
import { Direction } from "snake-game/typing";
import mongoose from "mongoose";
import { ActivationFunction } from "snake-ai/CalcUtils";
import { gaModelSchema } from "../mongo/GaModel";
import type { IGaModel } from "../mongo/GaModel";
import type { IndividualPlainObject } from "snake-ai/GaModel";

describe("check GaModel", () => {
  it("gaModelSchema", () => {
    const model = mongoose.model("tempTestGaModelSchema", gaModelSchema);

    const individual: IndividualPlainObject = {
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

    const gaModel: IGaModel = {
      worldWidth: 10,
      worldHeight: 10,
      hiddenLayersLength: [10, 10],
      hiddenLayerActivationFunction: ActivationFunction.RELU,
      populationSize: 4,
      surviveRate: 0.5,
      populationMutationRate: 0.5,
      geneMutationRate: 0.5,
      mutationAmount: 0.5,
      trialTimes: 1,
      generation: -1,
      populationHistory: [individual, individual, individual, individual],
      evolveResultHistory: [],
    };

    const gaModel2 = new model(gaModel);
    const { _id, ...objWithoutId } = gaModel2.toObject();
    expect(objWithoutId).toStrictEqual(gaModel);
  });
});
