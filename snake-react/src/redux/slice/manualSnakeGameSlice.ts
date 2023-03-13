import { createSlice } from "@reduxjs/toolkit";
import SnakeGame from "snake-game/SnakeGame";
import type { ISnakeGame } from "snake-game/SnakeGame";
import type { SnakeAction } from "snake-game/typing";
import type { RootState } from "../store";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ManualSnakeState {
  snakeGame: ISnakeGame;
}

let snakeGame: SnakeGame;

snakeGame = new SnakeGame({ worldWidth: 20, worldHeight: 20 });

const initialState: ManualSnakeState = {
  snakeGame: snakeGame.toPlainObject(),
};

export const manualSnakeGame = createSlice({
  name: "manualSnakeGame",
  initialState,
  reducers: {
    changeWorldSize: (state, action: PayloadAction<{ worldWidth: number; worldHeight: number }>) => {
      snakeGame = new SnakeGame(action.payload);
      state.snakeGame = snakeGame.toPlainObject();
    },
    snakeMove: (state, action: PayloadAction<SnakeAction>) => {
      snakeGame.snakeMove(action.payload);
      state.snakeGame = snakeGame.toPlainObject();
    },
  },
});

export const { snakeMove } = manualSnakeGame.actions;
export const selectManualSnakeGame = (state: RootState) => state.manualSnakeGame;
export default manualSnakeGame.reducer;
