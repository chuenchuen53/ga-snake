import { createSlice } from "@reduxjs/toolkit";
import SnakeGame from "snake-game/SnakeGame";
import type { ISnakeGame, GameRecord } from "snake-game/SnakeGame";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ReplayData {
  worldWidth: number;
  worldHeight: number;
  gameRecord: GameRecord;
}

interface ReplaySnakeState {
  snakeGame: ISnakeGame | null;
  replayData: ReplayData | null;
  nextMoveIndex: number;
  openModal: boolean;
}

let snakeGame: SnakeGame | null = null;

const initialState: ReplaySnakeState = {
  snakeGame: null,
  replayData: null,
  nextMoveIndex: -1,
  openModal: false,
};

export const replaySnakeGameSlice = createSlice({
  name: "replaySnakeGame",
  initialState,
  reducers: {
    nextMove: (state) => {
      if (!snakeGame || !state.replayData) throw new Error("nextMove is called when snakeGame | replayData is null");
      if (snakeGame.gameOver) throw new Error("nextMove is called when snakeGame is already game over");
      if (state.nextMoveIndex >= state.replayData.gameRecord.moveRecord.length) throw new Error("nextMove is called when nextMoveIndex is out of range");

      const moveRecordRow = state.replayData.gameRecord.moveRecord[state.nextMoveIndex];
      snakeGame.replayMove(moveRecordRow);
      state.snakeGame = snakeGame.toPlainObjectIgnoreMoveRecordAndAllPosition();
      state.nextMoveIndex++;
      if (state.nextMoveIndex >= state.replayData.gameRecord.moveRecord.length) {
        state.nextMoveIndex = -1;
      }
    },
    setNewReplay: (state, action: PayloadAction<ReplayData>) => {
      const snake = {
        positions: [action.payload.gameRecord.initialSnakePosition],
        direction: action.payload.gameRecord.initialSnakeDirection,
      };
      const food = action.payload.gameRecord.initialFoodPosition;

      snakeGame = new SnakeGame({
        worldWidth: action.payload.worldWidth,
        worldHeight: action.payload.worldHeight,
        providedInitialStatus: {
          snake,
          food,
          gameOver: false,
          moves: 0,
          movesForNoFood: 0,
          initialSnakePosition: snake.positions[0],
          initialSnakeDirection: snake.direction,
          initialFoodPosition: food,
          moveRecord: [],
        },
      });

      state.snakeGame = snakeGame.toPlainObject();
      state.replayData = action.payload;
      state.nextMoveIndex = 0;
      state.openModal = true;
    },
    clearReplay: (state) => {
      snakeGame = null;
      state.snakeGame = null;
      state.replayData = null;
      state.nextMoveIndex = 0;
      state.openModal = false;
    },
  },
});

export const { nextMove, setNewReplay, clearReplay } = replaySnakeGameSlice.actions;
