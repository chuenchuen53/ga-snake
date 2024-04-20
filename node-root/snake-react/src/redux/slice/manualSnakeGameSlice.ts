import { createSlice } from "@reduxjs/toolkit";
import SnakeGame from "snake-game/SnakeGame";
import type { ISnakeGame } from "snake-game/SnakeGame";
import type { Direction } from "snake-game/typing";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ManualSnakeState {
  snakeGame: ISnakeGame;
  worldWidth: number;
  worldHeight: number;
}

let snakeGame: SnakeGame = new SnakeGame({ worldWidth: 20, worldHeight: 20 });

const initialState: ManualSnakeState = {
  snakeGame: snakeGame.toPlainObject(),
  worldWidth: 20,
  worldHeight: 20,
};

export const manualSnakeGameSlice = createSlice({
  name: "manualSnakeGame",
  initialState,
  reducers: {
    changeWorldSize: (state) => {
      state.worldWidth = state.worldWidth ? Math.max(3, state.worldWidth) : 3;
      state.worldHeight = state.worldHeight ? Math.max(3, state.worldHeight) : 3;
      snakeGame = new SnakeGame({ worldWidth: state.worldWidth, worldHeight: state.worldHeight });
      state.snakeGame = snakeGame.toPlainObject();
    },
    snakeMove: (state, action: PayloadAction<Direction>) => {
      if (snakeGame.gameOver) return;
      snakeGame.snakeMoveByDirectionWithSuicidePrevention(action.payload);
      state.snakeGame = snakeGame.toPlainObject();
    },
    setWorldWidth: (state, action: PayloadAction<number>) => {
      state.worldWidth = action.payload;
    },
    setWorldHeight: (state, action: PayloadAction<number>) => {
      state.worldHeight = action.payload;
    },
  },
});

export const { snakeMove, changeWorldSize, setWorldWidth, setWorldHeight } = manualSnakeGameSlice.actions;
