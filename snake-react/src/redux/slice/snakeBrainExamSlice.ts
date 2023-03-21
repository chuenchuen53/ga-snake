import { createSlice } from "@reduxjs/toolkit";
import SnakeGame from "snake-game/SnakeGame";
import SnakeBrain from "snake-ai/SnakeBrain";
import InputLayer from "snake-ai/InputLayer";
import type { ISnakeBrain } from "snake-ai/SnakeBrain";
import type { ISnakeGame } from "snake-game/SnakeGame";
import type { PayloadAction } from "@reduxjs/toolkit";

interface SnakeBrainExamState {
  snakeGame: ISnakeGame | null;
  worldWidth: number;
  worldHeight: number;
  openModal: boolean;
}

let snakeGame: SnakeGame | null = null;
let inputLayer: InputLayer | null = null;
let snakeBrain: SnakeBrain | null = null;

const initialState: SnakeBrainExamState = {
  snakeGame: null,
  worldWidth: 20,
  worldHeight: 20,
  openModal: false,
};

export const snakeBrainExamSlice = createSlice({
  name: "snakeBrainExam",
  initialState,
  reducers: {
    startNewGame: (state) => {
      snakeGame = new SnakeGame({ worldWidth: state.worldWidth, worldHeight: state.worldHeight });
      inputLayer = new InputLayer(snakeGame);
      state.snakeGame = snakeGame.toPlainObjectIgnoreMoveRecordAndAllPosition();
    },
    setWorldSize: (state, action: PayloadAction<{ worldWidth: number; worldHeight: number }>) => {
      state.worldWidth = action.payload.worldWidth;
      state.worldHeight = action.payload.worldHeight;
      snakeGame = new SnakeGame({ worldWidth: action.payload.worldWidth, worldHeight: action.payload.worldHeight });
      inputLayer = new InputLayer(snakeGame);
      state.snakeGame = snakeGame.toPlainObjectIgnoreMoveRecordAndAllPosition();
    },
    setSnakeBrain: (state, action: PayloadAction<ISnakeBrain>) => {
      const { inputLength, layerShapes, hiddenLayerActivationFunction, weights, biases } = new SnakeBrain(action.payload);
      snakeBrain = new SnakeBrain({
        inputLength,
        layerShapes,
        hiddenLayerActivationFunction: hiddenLayerActivationFunction,
        providedWeightsAndBiases: {
          weights: weights,
          biases: biases,
        },
      });
      if (!snakeGame) {
        snakeGame = new SnakeGame({ worldWidth: state.worldWidth, worldHeight: state.worldHeight });
        inputLayer = new InputLayer(snakeGame);
        state.snakeGame = snakeGame.toPlainObjectIgnoreMoveRecordAndAllPosition();
      }
      state.openModal = true;
    },
    nextMove: (state) => {
      if (!snakeGame || !inputLayer || !snakeBrain) throw new Error("SnakeGame or InputLayer or SnakeBrain is not initialized");
      if (snakeGame.gameOver) throw new Error("nextMove is called when game is over");
      const direction = snakeBrain.compute(inputLayer.compute());
      snakeGame.snakeMoveByDirection(direction);
      state.snakeGame = snakeGame.toPlainObjectIgnoreMoveRecordAndAllPosition();
    },
    endExam: (state) => {
      snakeGame = null;
      inputLayer = null;
      snakeBrain = null;
      state.snakeGame = null;
      state.openModal = false;
    },
  },
});

export const { startNewGame, setSnakeBrain, setWorldSize, endExam, nextMove } = snakeBrainExamSlice.actions;
