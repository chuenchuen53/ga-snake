import { createSlice } from "@reduxjs/toolkit";
import SnakeGame from "snake-game/SnakeGame";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { GameRecord, ISnakeGame } from "snake-game/SnakeGame";

interface ReplaySnakeState {
  snakeGame: ISnakeGame | null;
  gameRecord: GameRecord | null;
  nextMoveIndex: number;
  openModal: boolean;
}

let snakeGame: SnakeGame | null = null;

const initialState: ReplaySnakeState = {
  snakeGame: null,
  gameRecord: null,
  nextMoveIndex: -1,
  openModal: false,
};

export const replaySnakeGameSlice = createSlice({
  name: "replaySnakeGame",
  initialState,
  reducers: {
    nextMove: (state) => {
      if (!snakeGame || !state.gameRecord) throw new Error("nextMove is called when snakeGame | gameRecord is null");
      if (snakeGame.gameOver) throw new Error("nextMove is called when snakeGame is already game over");
      if (state.nextMoveIndex >= state.gameRecord.moveRecord.length) throw new Error("nextMove is called when nextMoveIndex is out of range");

      const moveRecordRow = state.gameRecord.moveRecord[state.nextMoveIndex];
      snakeGame.replayMove(moveRecordRow);
      state.snakeGame = snakeGame.toPlainObjectIgnoreMoveRecordAndAllPosition();
      state.nextMoveIndex++;
      if (state.nextMoveIndex >= state.gameRecord.moveRecord.length) {
        state.nextMoveIndex = -1;
      }
    },
    setNewReplay: (state, action: PayloadAction<GameRecord>) => {
      const snake = {
        positions: [action.payload.initialSnakePosition],
        direction: action.payload.initialSnakeDirection,
      };
      const food = action.payload.initialFoodPosition;

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
      state.gameRecord = action.payload;
      state.nextMoveIndex = 0;
      state.openModal = true;
    },
    clearReplay: (state) => {
      snakeGame = null;
      state.snakeGame = null;
      state.snakeGame = null;
      state.nextMoveIndex = 0;
      state.openModal = false;
    },
  },
});

export const { nextMove, setNewReplay, clearReplay } = replaySnakeGameSlice.actions;
