import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppThunk, AppThunkDispatch, AppThunkGetState } from "../store";

export interface LoadingState {
  isLoading: boolean;
  snackBar: {
    open: boolean;
    display: null | {
      message: string;
      severity: "success" | "info" | "warning" | "error";
    };
  };
}

const initialState: LoadingState = {
  isLoading: false,
  snackBar: {
    open: false,
    display: null,
  },
};

export const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    openSnackBar: (state, action: PayloadAction<{ message: string; severity: "success" | "info" | "warning" | "error" }>) => {
      state.snackBar.open = true;
      state.snackBar.display = action.payload;
    },
    closeSnackBar: (state) => {
      state.snackBar.open = false;
      state.snackBar.display = null;
    },
  },
});

export const { setIsLoading, openSnackBar, closeSnackBar } = loadingSlice.actions;

export function withLoading(func: (dispatch: AppThunkDispatch, getState: AppThunkGetState) => Promise<void>): AppThunk {
  return async (dispatch, getState) => {
    try {
      dispatch(loadingSlice.actions.setIsLoading(true));
      await func(dispatch, getState);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e.message) {
        dispatch(openSnackBar({ message: e.message, severity: "error" }));
      } else {
        dispatch(openSnackBar({ message: "Fail", severity: "error" }));
      }
    } finally {
      dispatch(loadingSlice.actions.setIsLoading(false));
    }
  };
}

export function showSnackBarAfterAction(func: (dispatch: AppThunkDispatch, getState: AppThunkGetState) => Promise<void>): AppThunk {
  return async (dispatch, getState) => {
    try {
      await func(dispatch, getState);
      dispatch(openSnackBar({ message: "Success", severity: "success" }));
    } catch (e) {
      dispatch(openSnackBar({ message: "Fail", severity: "error" }));
    }
  };
}
