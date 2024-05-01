import { ActivationFunction } from "../CalcUtils";
import type { Options } from "../GaModel";

interface Setting {
  evolveTimes: number;
  gaPlayerConfig: Options;
}

export const setting: Setting = {
  evolveTimes: 2000,
  gaPlayerConfig: {
    worldWidth: 20,
    worldHeight: 20,
    snakeBrainConfig: {
      hiddenLayersLength: [16, 8],
      hiddenLayerActivationFunction: ActivationFunction.LINEAR,
    },
    gaConfig: {
      populationSize: 2000,
      surviveRate: 0.5,
      populationMutationRate: 0.2,
      geneMutationRate: 0.5,
      mutationAmount: 0.2,
      trialTimes: 1,
    },
  },
};
