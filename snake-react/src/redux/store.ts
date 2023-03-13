import { configureStore } from "@reduxjs/toolkit";
import counterSliceReducer from "./slice/counterSlice";
import manualSnakeGameSliceReducer from "./slice/manualSnakeGameSlice";

export const store = configureStore({
  reducer: {
    counter: counterSliceReducer,
    manualSnakeGame: manualSnakeGameSliceReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
