import { ActivationFunction } from "./CalcUtils";

export const SETTINGS: Setting = {
  recordInLocal: true,
  recordInDb: true,
  backupPopulation: true,
  backupPopulationInterval: 50,
  backupPopulationMaxLengthIncrement: 30,
  evolveTimes: 1000,
  gaPlayerConfig: {
    worldWidth: 20,
    worldHeight: 20,
    snakeBrainConfig: {
      hiddenLayersLength: [16, 8],
      hiddenLayerActivationFunction: ActivationFunction.LINEAR,
    },
    gaConfig: {
      populationSize: 1000,
      surviveRate: 0.5,
      mutationRate: 0.1,
      mutationAmount: 0.2,
      trialTimes: 1,
    },
  },
};

interface Setting {
  recordInLocal: boolean;
  recordInDb: boolean;
  backupPopulation: boolean;
  backupPopulationInterval: number;
  backupPopulationMaxLengthIncrement: number;
  evolveTimes: number;
  gaPlayerConfig: {
    worldWidth: number;
    worldHeight: number;
    snakeBrainConfig: {
      hiddenLayersLength: number[];
      hiddenLayerActivationFunction: ActivationFunction;
    };
    gaConfig: {
      populationSize: number;
      surviveRate: number;
      mutationRate: number;
      mutationAmount: number;
      trialTimes: number;
    };
  };
}
