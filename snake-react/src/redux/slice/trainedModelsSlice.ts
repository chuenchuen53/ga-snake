import { createSlice } from "@reduxjs/toolkit";
import TrainedModelsApi from "../../api/TrainedModels";
import type { AppThunk } from "../store";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { TrainedModel } from "snake-express/api-typing/trained-models";
import type { GetCurrentModelInfoResponse } from "snake-express/api-typing/training";

export interface TrainedModelsState {
  models: TrainedModel[] | null;
  openedDetail: GetCurrentModelInfoResponse | null;
}

const initialState: TrainedModelsState = {
  models: null,
  openedDetail: null,
};

export const trainedModelsSlice = createSlice({
  name: "trainedModels",
  initialState,
  reducers: {
    setModels: (state, action: PayloadAction<TrainedModel[]>) => {
      state.models = action.payload;
    },
    setOpenedDetail: (state, action: PayloadAction<GetCurrentModelInfoResponse | null>) => {
      state.openedDetail = action.payload;
    },
    removeModel: (state, action: PayloadAction<string>) => {
      if (state.models) {
        state.models = state.models.filter((model) => model.id !== action.payload);
      }
    },
  },
});

export const { setModels, setOpenedDetail } = trainedModelsSlice.actions;

export function getAllTrainedModelsThunk(): AppThunk {
  return async (dispatch) => {
    try {
      const resp = await TrainedModelsApi.getAllTrainedModels();
      dispatch(trainedModelsSlice.actions.setModels(resp.models));
    } catch (e) {
      // todo: handle error
    }
  };
}

export function getModelDetailThunk(id: string): AppThunk {
  return async (dispatch) => {
    try {
      const resp = await TrainedModelsApi.getModelDetail(id);
      dispatch(trainedModelsSlice.actions.setOpenedDetail(resp));
    } catch (e) {
      // todo: handle error
    }
  };
}

export function deleteModelThunk(id: string): AppThunk {
  return async (dispatch) => {
    try {
      await TrainedModelsApi.deleteModel(id);
      dispatch(trainedModelsSlice.actions.removeModel(id));
    } catch (e) {
      // todo: handle error
    }
  };
}
