import GaModel from "../GaModel";
import { ActivationFunction } from "../CalcUtils";
import SnakeBrain from "../SnakeBrain";

describe("GaModel test suite", () => {
  let gaModel: GaModel;

  beforeEach(() => {
    gaModel = new GaModel({
      worldWidth: 10,
      worldHeight: 10,
      snakeBrainConfig: {
        hiddenLayersLength: [10, 8],
        hiddenLayerActivationFunction: ActivationFunction.LINEAR,
      },
      gaConfig: {
        populationSize: 10,
        surviveRate: 0.8,
        mutationRate: 0.2,
        mutationAmount: 0.05,
        trialTimes: 2,
      },
    });
  });

  it("constructor test test", () => {
    expect(gaModel.generation).toBe(-1);
    expect(gaModel.worldWidth).toBe(10);
    expect(gaModel.worldHeight).toBe(10);
    expect(gaModel.hiddenLayersLength).toEqual([10, 8]);
    expect(gaModel.hiddenLayerActivationFunction).toBe(ActivationFunction.LINEAR);
    expect(gaModel.populationSize).toBe(10);
    expect(gaModel.surviveRate).toBe(0.8);
    expect(gaModel.mutationRate).toBe(0.2);
    expect(gaModel.mutationAmount).toBe(0.05);
    expect(gaModel.trialTimes).toBe(2);
    expect(gaModel.numberOfSurvival).toBe(8);
  });

  it("spinRouletteWheel test 1", () => {
    const snakeBrain = new SnakeBrain({
      inputLength: 10,
      layerShapes: [
        [8, 10],
        [4, 8],
      ],
      hiddenLayerActivationFunction: ActivationFunction.LINEAR,
    });
    const fitnessArr = [1000, 500, 200, 100];
    const population = fitnessArr.map((fitness) => ({
      snakeBrain,
      snakeLength: 0,
      moves: 0,
      fitness,
      survive: false,
      gameRecords: "",
    }));

    const count = [0, 0, 0, 0];
    const times = 100000;
    for (let i = 0; i < times; i++) {
      const result = GaModel.spinRouletteWheel(population);
      count[fitnessArr.indexOf(result.fitness)]++;
    }

    expect(count.reduce((acc, cur) => acc + cur, 0)).toBe(times);

    const ratio = count.map((c) => c / times);
    const tolerance = 0.01;
    const sumOfFitness = fitnessArr.reduce((acc, cur) => acc + cur, 0);
    const idealRatio = fitnessArr.map((f) => f / sumOfFitness);

    for (let i = 0; i < ratio.length; i++) {
      expect(ratio[i]).toBeGreaterThan(idealRatio[i] - tolerance);
      expect(ratio[i]).toBeLessThan(idealRatio[i] + tolerance);
    }
  });

  it("spinRouletteWheel test 2", () => {
    const snakeBrain = new SnakeBrain({
      inputLength: 10,
      layerShapes: [
        [8, 10],
        [4, 8],
      ],
      hiddenLayerActivationFunction: ActivationFunction.LINEAR,
    });
    const fitnessArr = [123, 2222, 378, 78090];
    const population = fitnessArr.map((fitness) => ({
      snakeBrain,
      snakeLength: 0,
      moves: 0,
      fitness,
      survive: false,
      gameRecords: "",
    }));

    const count = [0, 0, 0, 0];
    const times = 100000;
    for (let i = 0; i < times; i++) {
      const result = GaModel.spinRouletteWheel(population);
      count[fitnessArr.indexOf(result.fitness)]++;
    }

    expect(count.reduce((acc, cur) => acc + cur, 0)).toBe(times);

    const ratio = count.map((c) => c / times);
    const tolerance = 0.01;
    const sumOfFitness = fitnessArr.reduce((acc, cur) => acc + cur, 0);
    const idealRatio = fitnessArr.map((f) => f / sumOfFitness);

    for (let i = 0; i < ratio.length; i++) {
      expect(ratio[i]).toBeGreaterThan(idealRatio[i] - tolerance);
      expect(ratio[i]).toBeLessThan(idealRatio[i] + tolerance);
    }
  });
});
