import { createSlice } from "@reduxjs/toolkit";
import TrainedModelsApi from "../../api/TrainedModels";
import { withLoading } from "./loadingSlice";
import type { AppThunk } from "../store";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { TrainedModel } from "snake-express/api-typing/trained-models";
import type { ModelInfo } from "snake-express/api-typing/training";

export interface ResumeModelPayload {
  modelId: string;
  generation: number;
}

export interface TrainedModelsState {
  models: TrainedModel[] | null;
  openedDetail: ModelInfo | null;
  openResumeModal: ResumeModelPayload[] | null;
}

const initialState: TrainedModelsState = {
  models: null,
  openedDetail: null,
  openResumeModal: null,
};

export const trainedModelsSlice = createSlice({
  name: "trainedModels",
  initialState,
  reducers: {
    setModels: (state, action: PayloadAction<TrainedModel[]>) => {
      state.models = action.payload;
    },
    setOpenedDetail: (state, action: PayloadAction<ModelInfo | null>) => {
      state.openedDetail = action.payload;
    },
    setOpenResumeModal: (state, action: PayloadAction<ResumeModelPayload[] | null>) => {
      state.openResumeModal = action.payload;
    },
    removeModel: (state, action: PayloadAction<string>) => {
      if (state.models) {
        state.models = state.models.filter((model) => model._id !== action.payload);
      }
    },
  },
});

export const { setModels, setOpenedDetail, setOpenResumeModal } = trainedModelsSlice.actions;

export function getAllTrainedModelsThunk(): AppThunk {
  return withLoading(async (dispatch) => {
    const resp = await TrainedModelsApi.getAllTrainedModels();
    dispatch(trainedModelsSlice.actions.setModels(resp.models));
  });
}

export function getModelDetailThunk(id: string): AppThunk {
  return withLoading(async (dispatch) => {
    const resp = await TrainedModelsApi.getModelDetail(id);
    dispatch(trainedModelsSlice.actions.setOpenedDetail(resp));
  });
}

export function deleteModelThunk(id: string): AppThunk {
  return withLoading(async (dispatch) => {
    await TrainedModelsApi.deleteModel(id);
    dispatch(trainedModelsSlice.actions.removeModel(id));
  });
}
