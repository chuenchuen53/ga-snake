import { configureStore } from "@reduxjs/toolkit";
import { trainingSlice } from "./slice/trainingSlice";
import { manualSnakeGameSlice } from "./slice/manualSnakeGameSlice";
import { replaySnakeGameSlice } from "./slice/replaySnakeGameSlice";
import { trainedModelsSlice } from "./slice/trainedModelsSlice";
import { snakeBrainExamSlice } from "./slice/snakeBrainExamSlice";
import type { AnyAction, ThunkAction } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    training: trainingSlice.reducer,
    manualSnakeGame: manualSnakeGameSlice.reducer,
    replaySnakeGame: replaySnakeGameSlice.reducer,
    trainedModels: trainedModelsSlice.reducer,
    snakeBrainExam: snakeBrainExamSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;
