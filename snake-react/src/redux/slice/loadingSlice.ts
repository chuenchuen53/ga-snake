import { createSlice } from "@reduxjs/toolkit";
import type { AppThunkDispatch, AppThunkGetState, AppThunk } from "../store";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface LoadingState {
  isLoading: boolean;
}

const initialState: LoadingState = {
  isLoading: false,
};

export const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setIsLoading } = loadingSlice.actions;

export function withLoading(func: (dispatch: AppThunkDispatch, getState: AppThunkGetState) => Promise<void>): AppThunk {
  return async (dispatch, getState) => {
    try {
      dispatch(loadingSlice.actions.setIsLoading(true));
      await func(dispatch, getState);
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(loadingSlice.actions.setIsLoading(false));
    }
  };
}
