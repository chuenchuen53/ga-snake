import { describe, expect, it } from "@jest/globals";
import GaModel from "../GaModel";
import { ActivationFunction } from "../CalcUtils";
import SnakeBrain from "../SnakeBrain";

describe("GaModel test suite", () => {
  describe("spinRouletteWheel", () => {
    const testCases = [
      { fitnessArr: [15, 20, 94, 18, 35] },
      { fitnessArr: [1000, 500, 200, 100] },
      { fitnessArr: [123, 2222, 378, 78090] },
      { fitnessArr: [15, 20, 94, 18, 35, 50, 79] },
      { fitnessArr: [79, 50, 35, 18, 94, 20, 15] },
    ];

    const cumulativeSums = [
      [15, 35, 129, 147, 182],
      [1000, 1500, 1700, 1800],
      [123, 2345, 2723, 80813],
      [15, 35, 129, 147, 182, 232, 311],
      [79, 129, 164, 182, 276, 296, 311],
    ];

    it.each(cumulativeSums)("calculateCumulativeSum should produce expected cumulative sum for given values", () => {
      testCases.forEach((testCase, index) => {
        const result = GaModel.calculateCumulativeSum(testCase.fitnessArr);
        expect(result).toEqual(cumulativeSums[index]);
      });
    });

    it.each(testCases)("should produce expected ratio for given fitnessArr", ({ fitnessArr }) => {
      const snakeBrain = new SnakeBrain({
        inputLength: 10,
        layerShapes: [
          [8, 10],
          [4, 8],
        ],
        hiddenLayerActivationFunction: ActivationFunction.LINEAR,
      });

      const population = fitnessArr.map((fitness) => ({
        snakeBrain,
        snakeLength: 0,
        moves: 0,
        fitness,
        survive: false,
        gameRecord: null,
      }));

      const count = fitnessArr.map(() => 0);
      const times = 100000;
      const cumulativeSumList = GaModel.calculateCumulativeSum(fitnessArr);
      for (let i = 0; i < times; i++) {
        const result = GaModel.spinRouletteWheel(population, cumulativeSumList);
        count[fitnessArr.indexOf(result.fitness)]++;
      }

      expect(count.reduce((acc, cur) => acc + cur, 0)).toBe(times);

      const ratio = count.map((c) => c / times);
      const tolerance = 0.02;
      const sumOfFitness = fitnessArr.reduce((acc, cur) => acc + cur, 0);
      const idealRatio = fitnessArr.map((f) => f / sumOfFitness);

      for (let i = 0; i < ratio.length; i++) {
        expect(ratio[i]).toBeGreaterThan(idealRatio[i] - tolerance);
        expect(ratio[i]).toBeLessThan(idealRatio[i] + tolerance);
      }
    });
  });

  it("fitness test 1", () => {
    // assume worldWidth = 20, worldHeight = 20, max possible snake length = 400
    // ensure fitness is less than max possible number / 1e8
    const moves = 1000;
    const snakeLength = 400;

    const fitness = GaModel.fitness(moves, snakeLength, 400);
    expect(fitness).toBeLessThan(Number.MAX_VALUE / 1e8);
  });
});
