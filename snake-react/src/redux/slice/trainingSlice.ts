import { createSlice } from "@reduxjs/toolkit";
import { ActivationFunction } from "snake-ai/CalcUtils";
import TrainingApi from "../../api/Training";
import { openSnackBar, showSnackBarAfterAction, withLoading } from "./loadingSlice";
import type { Draft, PayloadAction } from "@reduxjs/toolkit";
import type { GetCurrentModelInfoResponse, PollingInfoResponse } from "snake-express/api-typing/training";
import type { AppThunk } from "../store";
import type { Options } from "snake-ai/GaModel";

interface TrainingState {
  gaModelSetting: Options;
  evolveTimes: number;
  backupPopulationWhenFinish: boolean;
  evolving: boolean;
  waitingLastEvolveAfterStop: boolean;
  backupInProgress: boolean;
  subscribed: boolean;
  waitingForPolling: boolean;
  currentModelInfo: null | GetCurrentModelInfoResponse;
}

const initialState: TrainingState = {
  gaModelSetting: {
    worldWidth: 20,
    worldHeight: 20,
    snakeBrainConfig: {
      hiddenLayersLength: [16, 8],
      hiddenLayerActivationFunction: ActivationFunction.LINEAR,
    },
    gaConfig: {
      populationSize: 5000,
      surviveRate: 0.5,
      populationMutationRate: 0.1,
      geneMutationRate: 0.5,
      mutationAmount: 0.2,
      trialTimes: 1,
    },
  },
  evolveTimes: 100,
  backupPopulationWhenFinish: false,
  evolving: false,
  waitingLastEvolveAfterStop: false,
  backupInProgress: false,
  subscribed: false,
  waitingForPolling: false,
  currentModelInfo: null,
};

export type GaModelSettingKey = keyof typeof initialState.gaModelSetting;
export const gaModelSettingKeys: Readonly<GaModelSettingKey[]> = ["worldWidth", "worldHeight", "snakeBrainConfig", "gaConfig"];

export type SnakeBrainConfigKey = keyof typeof initialState.gaModelSetting.snakeBrainConfig;
export const snakeBrainConfigKeys: Readonly<SnakeBrainConfigKey[]> = ["hiddenLayersLength", "hiddenLayerActivationFunction"];

export type GaConfigKey = keyof typeof initialState.gaModelSetting.gaConfig;
export const gaConfigKeys: Readonly<GaConfigKey[]> = ["populationSize", "surviveRate", "populationMutationRate", "geneMutationRate", "mutationAmount", "trialTimes"];

export const trainingSlice = createSlice({
  name: "training",
  initialState,
  reducers: {
    changeSetting: <K extends keyof Options>(state: Draft<TrainingState>, action: PayloadAction<{ key: K; value: Options[K] }>) => {
      state.gaModelSetting[action.payload.key] = action.payload.value;
    },
    setEvolveTimes: (state, action: PayloadAction<string>) => {
      state.evolveTimes = parseInt(action.payload) || 0;
    },
    setBackupPopulationWhenFinish: (state, action: PayloadAction<boolean>) => {
      state.backupPopulationWhenFinish = action.payload;
    },
    setCurrentModelInfo: (state, action: PayloadAction<GetCurrentModelInfoResponse | null>) => {
      state.currentModelInfo = action.payload;
    },
    setEvolving: (state, action: PayloadAction<boolean>) => {
      state.evolving = action.payload;
    },
    setWaitingLastEvolveAfterStop: (state, action: PayloadAction<boolean>) => {
      state.waitingLastEvolveAfterStop = action.payload;
    },
    setBackupInProgress: (state, action: PayloadAction<boolean>) => {
      state.backupInProgress = action.payload;
    },
    setSubscribed: (state, action: PayloadAction<boolean>) => {
      state.subscribed = action.payload;
    },
    setWaitingForPolling: (state, action: PayloadAction<boolean>) => {
      state.waitingForPolling = action.payload;
    },
    updateCurrentModelInfo: (state, action: PayloadAction<PollingInfoResponse>) => {
      if (!state.currentModelInfo) return;
      if (action.payload.newEvolveResultHistory.length) {
        state.currentModelInfo.evolveResultHistory.push(...action.payload.newEvolveResultHistory);
        state.currentModelInfo.generation = action.payload.newEvolveResultHistory[action.payload.newEvolveResultHistory.length - 1].generation;
      }
      if (action.payload.newPopulationHistory.length) {
        state.currentModelInfo.populationHistory.push(...action.payload.newPopulationHistory);
      }
      if (action.payload.backupPopulationInProgress !== state.backupInProgress) {
        state.backupInProgress = action.payload.backupPopulationInProgress;
      }
      if (action.payload.backupPopulationWhenFinish !== state.backupPopulationWhenFinish) {
        state.backupPopulationWhenFinish = action.payload.backupPopulationWhenFinish;
      }
      if (action.payload.evolving !== state.evolving) {
        state.evolving = action.payload.evolving;
        if (!action.payload.evolving && state.waitingLastEvolveAfterStop) {
          state.waitingLastEvolveAfterStop = false;
        }
      }
    },
  },
});

export function initModelThunk(): AppThunk {
  return async (dispatch, getState) => {
    const { training } = getState();
    if (training.currentModelInfo) return;

    dispatch(
      withLoading(async (dispatch) => {
        const resp = await TrainingApi.initModel({ options: training.gaModelSetting });
        dispatch(trainingSlice.actions.setCurrentModelInfo(resp));
        dispatch(startSubscribeInfoThunk());
      })
    );
  };
}

export function evolveThunk(): AppThunk {
  return async (dispatch, getState) => {
    const { training } = getState();
    if (!training.currentModelInfo) return;
    if (training.evolveTimes <= 0) return;

    dispatch(
      showSnackBarAfterAction(async (dispatch) => {
        await TrainingApi.evolve({ times: training.evolveTimes });
        dispatch(trainingSlice.actions.setEvolving(true));
      })
    );
  };
}

export function stopEvolveThunk(): AppThunk {
  return showSnackBarAfterAction(async (dispatch) => {
    await TrainingApi.stopEvolve();
    dispatch(trainingSlice.actions.setWaitingLastEvolveAfterStop(true));
  });
}

export function backupCurrentPopulationThunk(): AppThunk {
  return async (dispatch) => {
    try {
      dispatch(trainingSlice.actions.setBackupInProgress(true));
      await TrainingApi.backupCurrentPopulation();
      dispatch(trainingSlice.actions.setBackupInProgress(false));
    } catch (e) {
      dispatch(trainingSlice.actions.setBackupInProgress(false));
      dispatch(openSnackBar({ message: "Fail", severity: "error" }));
    }
  };
}

export function toggleBackupPopulationWhenFinishThunk(): AppThunk {
  return showSnackBarAfterAction(async (dispatch, getState) => {
    const { training } = getState();
    const newState = !training.backupPopulationWhenFinish;
    await TrainingApi.toggleBackupPopulationWhenFinish({ backup: newState });
    dispatch(trainingSlice.actions.setBackupPopulationWhenFinish(newState));
  });
}

export function getCurrentModelInfoThunk(): AppThunk {
  return withLoading(async (dispatch) => {
    const resp = await TrainingApi.getCurrentModelInfo();
    dispatch(trainingSlice.actions.setCurrentModelInfo(resp));
    dispatch(startSubscribeInfoThunk());
  });
}

export function removeCurrentModelThunk(): AppThunk {
  return withLoading(async (dispatch) => {
    dispatch(stopSubscribeInfoThunk());
    await TrainingApi.removeCurrentModel();
    dispatch(trainingSlice.actions.setCurrentModelInfo(null));
    dispatch(stopSubscribeInfoThunk());
  });
}

export function startSubscribeInfoThunk(): AppThunk {
  return async (dispatch, getState) => {
    const { training } = getState();
    if (!training.currentModelInfo || training.subscribed || training.waitingForPolling) return;
    dispatch(trainingSlice.actions.setSubscribed(true));
    window.setTimeout(() => dispatch(subscribeInfoThunk()), 0);
  };
}

export function stopSubscribeInfoThunk(): AppThunk {
  return async (dispatch) => {
    dispatch(trainingSlice.actions.setSubscribed(false));
  };
}

function subscribeInfoThunk(): AppThunk {
  return async (dispatch, getState) => {
    try {
      if (!getState().training.waitingForPolling) {
        dispatch(trainingSlice.actions.setWaitingForPolling(true));
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- checked by startSubscribeInfoThunk
      const currentModelInfo = getState().training.currentModelInfo!;

      const currentEvolvingResultHistoryGeneration = currentModelInfo.evolveResultHistory[currentModelInfo.evolveResultHistory.length - 1]?.generation ?? -1;
      const currentPopulationHistoryGeneration = currentModelInfo.populationHistory[currentModelInfo.populationHistory.length - 1]?.generation ?? -1;
      const currentBackupPopulationInProgress = getState().training.backupInProgress;
      const currentBackupPopulationWhenFinish = getState().training.backupPopulationWhenFinish;
      const currentEvolving = getState().training.evolving;

      const result: PollingInfoResponse = await TrainingApi.pollingInfo(
        currentEvolvingResultHistoryGeneration,
        currentPopulationHistoryGeneration,
        currentBackupPopulationInProgress,
        currentBackupPopulationWhenFinish,
        currentEvolving
      );
      dispatch(trainingSlice.actions.updateCurrentModelInfo(result));

      if (getState().training.subscribed) {
        dispatch(subscribeInfoThunk());
      } else {
        dispatch(trainingSlice.actions.setWaitingForPolling(false));
      }
    } catch (e) {
      dispatch(trainingSlice.actions.setSubscribed(false));
      dispatch(trainingSlice.actions.setWaitingForPolling(false));
      dispatch(openSnackBar({ message: "Fail", severity: "error" }));
    }
  };
}

export const { changeSetting, setEvolveTimes } = trainingSlice.actions;
