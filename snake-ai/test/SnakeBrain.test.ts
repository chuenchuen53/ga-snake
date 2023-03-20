import { describe } from "node:test";
import { Direction } from "snake-game/typing";
import SnakeBrain from "../SnakeBrain";
import { ActivationFunction } from "../CalcUtils";

describe("test suite for SnakeBrain", () => {
  describe("constructor test suite", () => {
    it("should fail as num of layer is less than 1", () => {
      expect(
        () =>
          new SnakeBrain({
            inputLength: 3,
            layerShapes: [],
            hiddenLayerActivationFunction: ActivationFunction.LINEAR,
          })
      ).toThrowError("Invalid layer shapes");
    });

    it("should fail as 1st layer not match with inputLength ", () => {
      expect(
        () =>
          new SnakeBrain({
            inputLength: 3,
            layerShapes: [[4, 4]],
            hiddenLayerActivationFunction: ActivationFunction.LINEAR,
          })
      ).toThrowError("Invalid layer shapes");
    });

    it("should fail as output layer not equal 4", () => {
      expect(
        () =>
          new SnakeBrain({
            inputLength: 3,
            layerShapes: [[3, 3]],
            hiddenLayerActivationFunction: ActivationFunction.LINEAR,
          })
      ).toThrowError("Invalid layer shapes");
    });

    it("should fail as intermediate layer not match", () => {
      expect(
        () =>
          new SnakeBrain({
            inputLength: 3,
            layerShapes: [
              [3, 3],
              [5, 5],
              [4, 4],
            ],
            hiddenLayerActivationFunction: ActivationFunction.LINEAR,
          })
      ).toThrowError("Invalid layer shapes");
    });

    it("should create a new SnakeBrain with 1 hidden layer", () => {
      const snakeBrain = new SnakeBrain({
        inputLength: 3,
        layerShapes: [[4, 3]],
        hiddenLayerActivationFunction: ActivationFunction.RELU,
      });

      expect(snakeBrain).toBeDefined();
      expect(snakeBrain.inputLength).toBe(3);
      expect(snakeBrain.layerShapes).toStrictEqual([[4, 3]]);
      expect(snakeBrain.hiddenLayerActivationFunction).toBe(ActivationFunction.RELU);
      expect(snakeBrain.weightArr.length).toBe(1);
      expect(snakeBrain.weightArr[0].length).toBe(4);
      expect(snakeBrain.weightArr[0][0].length).toBe(3);
      expect(snakeBrain.biasesArr.length).toBe(1);
      expect(snakeBrain.biasesArr[0].length).toBe(4);
      expect(snakeBrain.validateWeightAndBias()).toBe(true);
    });

    it("should create a new SnakeBrain with 2 hidden layers", () => {
      const snakeBrain = new SnakeBrain({
        inputLength: 5,
        layerShapes: [
          [7, 5],
          [4, 7],
        ],
        hiddenLayerActivationFunction: ActivationFunction.LINEAR,
      });

      expect(snakeBrain).toBeDefined();
      expect(snakeBrain.inputLength).toBe(5);
      expect(snakeBrain.layerShapes).toStrictEqual([
        [7, 5],
        [4, 7],
      ]);
      expect(snakeBrain.hiddenLayerActivationFunction).toBe(ActivationFunction.LINEAR);
      expect(snakeBrain.weightArr.length).toBe(2);
      expect(snakeBrain.weightArr[0].length).toBe(7);
      expect(snakeBrain.weightArr[0][0].length).toBe(5);
      expect(snakeBrain.weightArr[1].length).toBe(4);
      expect(snakeBrain.weightArr[1][0].length).toBe(7);
      expect(snakeBrain.biasesArr.length).toBe(2);
      expect(snakeBrain.biasesArr[0].length).toBe(7);
      expect(snakeBrain.biasesArr[1].length).toBe(4);
      expect(snakeBrain.validateWeightAndBias()).toBe(true);
    });

    it("should create a new SnakeBrain with 3 hidden layers", () => {
      const snakeBrain = new SnakeBrain({
        inputLength: 9,
        layerShapes: [
          [8, 9],
          [7, 8],
          [4, 7],
        ],
        hiddenLayerActivationFunction: ActivationFunction.TANH,
      });

      expect(snakeBrain).toBeDefined();
      expect(snakeBrain.inputLength).toBe(9);
      expect(snakeBrain.layerShapes).toEqual([
        [8, 9],
        [7, 8],
        [4, 7],
      ]);
      expect(snakeBrain.hiddenLayerActivationFunction).toBe(ActivationFunction.TANH);
      expect(snakeBrain.weightArr.length).toBe(3);
      expect(snakeBrain.weightArr[0].length).toBe(8);
      expect(snakeBrain.weightArr[0][0].length).toBe(9);
      expect(snakeBrain.weightArr[1].length).toBe(7);
      expect(snakeBrain.weightArr[1][0].length).toBe(8);
      expect(snakeBrain.weightArr[2].length).toBe(4);
      expect(snakeBrain.weightArr[2][0].length).toBe(7);
      expect(snakeBrain.biasesArr.length).toBe(3);
      expect(snakeBrain.biasesArr[0].length).toBe(8);
      expect(snakeBrain.biasesArr[1].length).toBe(7);
      expect(snakeBrain.biasesArr[2].length).toBe(4);
      expect(snakeBrain.validateWeightAndBias()).toBe(true);
    });

    it("should fail as the provided invalided weightArr and biasesArr", () => {
      expect(
        () =>
          new SnakeBrain({
            inputLength: 3,
            layerShapes: [[4, 3]],
            hiddenLayerActivationFunction: ActivationFunction.RELU,
            providedWeightAndBias: {
              weightArr: [],
              biasesArr: [[0.1, 0.1, 0.1, 0.1]],
            },
          })
      ).toThrowError("Invalid provided weight and bias");

      expect(
        () =>
          new SnakeBrain({
            inputLength: 3,
            layerShapes: [[4, 3]],
            hiddenLayerActivationFunction: ActivationFunction.RELU,
            providedWeightAndBias: {
              weightArr: [
                [
                  [0.1, 0.1, 0.1],
                  [0.1, 0.1, 0.1],
                  [0.1, 0.1, 0.1],
                  [0.1, 0.1, 0.1],
                ],
              ],
              biasesArr: [],
            },
          })
      ).toThrowError("Invalid provided weight and bias");

      expect(
        () =>
          new SnakeBrain({
            inputLength: 3,
            layerShapes: [[4, 3]],
            hiddenLayerActivationFunction: ActivationFunction.RELU,
            providedWeightAndBias: {
              weightArr: [
                [
                  [0.1, 0.1, 0.1],
                  [0.1, 0.1, 0.1],
                  [0.1, 0.1, 0.1],
                  [0.1, 0.1, 0.1],
                ],
              ],
              biasesArr: [[0.1, 0.1]],
            },
          })
      ).toThrowError("Invalid provided weight and bias");
    });
  });

  describe("compute test suite", () => {
    it("compute test 1", () => {
      const snakeBrain = new SnakeBrain({
        inputLength: 2,
        layerShapes: [
          [5, 2],
          [4, 5],
        ],
        hiddenLayerActivationFunction: ActivationFunction.LINEAR,
        providedWeightAndBias: {
          weightArr: [
            [
              [0.1, 0.15],
              [0.2, 0.25],
              [0.3, 0.35],
              [0.4, 0.45],
              [0.5, 0.55],
            ],
            [
              [0.1, 0.15, 0.2, 0.25, 0.3],
              [0.2, 0.25, 0.3, 0.35, 0.4],
              [0.3, 0.35, 0.4, 0.45, 0.5],
              [0.4, 0.45, 0.5, 0.55, 0.6],
            ],
          ],
          biasesArr: [
            [0.1, 0.1, 0.1, 0.1, 0.1],
            [0.1, -0.1, 0.1, -0.1],
          ],
        },
      });

      expect(snakeBrain.compute([0.1, 0.2])).toStrictEqual(Direction.LEFT);
      expect(snakeBrain.compute([-0.8, -0.7])).toStrictEqual(Direction.UP);
    });
  });

  describe("crossOver test suite", () => {
    it("crossOver test 1", () => {
      const options = {
        inputLength: 2,
        layerShapes: [
          [5, 2],
          [4, 5],
        ],
        hiddenLayerActivationFunction: ActivationFunction.LINEAR,
      };
      const parent1 = new SnakeBrain(options);
      const parent2 = new SnakeBrain(options);
      const child = new SnakeBrain(options);

      child.crossOver(parent1, parent2);

      const parent1FlattenedWeightArr = parent1.weightArr.flat(2);
      const parent1FlattenedBiasesArr = parent1.biasesArr.flat(1);

      const parent2FlattenedWeightArr = parent2.weightArr.flat(2);
      const parent2FlattenedBiasesArr = parent2.biasesArr.flat(1);

      const childFlattenedWeightArr = child.weightArr.flat(2);
      const childFlattenedBiasesArr = child.biasesArr.flat(1);

      const minDiffInArr = (x: number[], a: number[], b: number[]) => x.map((v, i) => Math.min(Math.abs(v - a[i]), Math.abs(v - b[i])));

      const diffInWeightArr = minDiffInArr(childFlattenedWeightArr, parent1FlattenedWeightArr, parent2FlattenedWeightArr);
      const diffInBiasesArr = minDiffInArr(childFlattenedBiasesArr, parent1FlattenedBiasesArr, parent2FlattenedBiasesArr);

      for (const x of diffInWeightArr) {
        expect(x).toBeCloseTo(0);
      }

      for (const x of diffInBiasesArr) {
        expect(x).toBeCloseTo(0);
      }
    });
  });

  describe("mutate test suite", () => {
    it("mutate test 1", () => {
      const mutationRate = 0.2;
      const mutationAmount = 0.05;

      const options = {
        inputLength: 2,
        layerShapes: [
          [10000, 2],
          [4, 10000],
        ],
        hiddenLayerActivationFunction: ActivationFunction.LINEAR,
      };
      const snakeBrain = new SnakeBrain(options);

      const originalWeightArr = snakeBrain.weightArr.flat(2).slice();
      const originalBiasesArr = snakeBrain.biasesArr.flat(1).slice();

      snakeBrain.mutate(mutationRate, mutationAmount);

      const mutatedWeightArr = snakeBrain.weightArr.flat(2);
      const mutatedBiasesArr = snakeBrain.biasesArr.flat(1);

      const diffInWeightArr = mutatedWeightArr.map((v, i) => Math.abs(v - originalWeightArr[i]));
      const diffInBiasesArr = mutatedBiasesArr.map((v, i) => Math.abs(v - originalBiasesArr[i]));

      let largerThanZeroCount = 0;
      for (const x of diffInWeightArr) {
        expect(x).toBeLessThanOrEqual(mutationAmount);
        if (x > 0.000001) {
          largerThanZeroCount++;
        }
      }

      let largerThanZeroCount2 = 0;
      for (const x of diffInBiasesArr) {
        expect(x).toBeLessThanOrEqual(mutationAmount);
        if (x > 0.000001) {
          largerThanZeroCount2++;
        }
      }

      const tolerance = 0.01;
      expect(largerThanZeroCount / diffInWeightArr.length - mutationRate).toBeLessThan(tolerance);
      expect(largerThanZeroCount2 / diffInBiasesArr.length - mutationRate).toBeLessThan(tolerance);
    });
  });

  describe("export exportBrainToJson test suite", () => {
    it("export exportBrainToJson test 1", () => {
      const options = {
        inputLength: 2,
        layerShapes: [[4, 2]],
        hiddenLayerActivationFunction: ActivationFunction.LINEAR,
      };
      const snakeBrain = new SnakeBrain(options);
      const exportedBrain = snakeBrain.exportBrainToJson();

      const snakeBrainPlainObject = JSON.parse(exportedBrain);

      expect(snakeBrainPlainObject.inputLength).toBe(snakeBrain.inputLength);
      expect(snakeBrainPlainObject.layerShapes).toStrictEqual(snakeBrain.layerShapes);
      expect(snakeBrainPlainObject.hiddenLayerActivationFunction).toBe(snakeBrain.hiddenLayerActivationFunction);
      expect(snakeBrainPlainObject.weightArr).toStrictEqual(snakeBrain.weightArr);
      expect(snakeBrainPlainObject.biasesArr).toStrictEqual(snakeBrain.biasesArr);
    });
  });
});
