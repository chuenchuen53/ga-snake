import GaModel from "../GaModel";
import { ActivationFunction } from "../CalcUtils";

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

  it("evolveMultipleTimes test", () => {
    const evolveSpy = jest.spyOn(gaModel, "evolve").mockImplementation(async () => {
      return;
    });

    gaModel.evolveMultipleTimes(3, false);
    expect(evolveSpy).toHaveBeenCalledTimes(3);

    gaModel.evolveMultipleTimes(4, false);
    expect(evolveSpy).toHaveBeenCalledTimes(7);
  });
});
