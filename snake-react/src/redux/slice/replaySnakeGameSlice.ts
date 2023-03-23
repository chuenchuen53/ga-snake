import { createSlice } from "@reduxjs/toolkit";
import SnakeGame from "snake-game/SnakeGame";
import SnakeBrain from "snake-ai/SnakeBrain";
import InputLayer from "snake-ai/InputLayer";
import type { ISnakeBrain } from "snake-ai/SnakeBrain";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { GameRecord, ISnakeGame } from "snake-game/SnakeGame";

interface ReplaySnakeState {
  snakeGame: ISnakeGame | null;
  gameRecord: GameRecord | null;
  nextMoveIndex: number;
  openModal: boolean;
}

let snakeGame: SnakeGame | null = null;
let inputLayer: InputLayer | null = null;
let snakeBrain: SnakeBrain | null = null;

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

      // for debug
      if (snakeBrain && inputLayer) {
        const computed = SnakeGame.directionMap[snakeBrain.compute(inputLayer.compute())];
        const record = moveRecordRow % 10;
        if (computed !== record) {
          console.log(`unmatched move: computed ${computed}, recorded ${record}`);
        }
      }

      snakeGame.replayMove(moveRecordRow);
      state.snakeGame = snakeGame.toPlainObjectIgnoreMoveRecordAndAllPosition();
      state.nextMoveIndex++;
      if (state.nextMoveIndex >= state.gameRecord.moveRecord.length) {
        state.nextMoveIndex = -1;
      }
    },
    setNewReplay: (state, action: PayloadAction<{ gameRecord: GameRecord; snakeBrain: ISnakeBrain }>) => {
      const gameRecord = action.payload.gameRecord;
      const snakeBrainData = action.payload.snakeBrain;
      const snake = {
        positions: [gameRecord.initialSnakePosition],
        direction: gameRecord.initialSnakeDirection,
      };
      const food = gameRecord.initialFoodPosition;

      snakeGame = new SnakeGame({
        worldWidth: gameRecord.worldWidth,
        worldHeight: gameRecord.worldHeight,
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

      inputLayer = new InputLayer(snakeGame);

      snakeBrain = new SnakeBrain({
        inputLength: snakeBrainData.inputLength,
        layerShapes: snakeBrainData.layerShapes,
        hiddenLayerActivationFunction: snakeBrainData.hiddenLayerActivationFunction,
        providedWeightsAndBiases: {
          weights: snakeBrainData.weights,
          biases: snakeBrainData.biases,
        },
      });

      state.snakeGame = snakeGame.toPlainObject();
      state.gameRecord = gameRecord;
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
