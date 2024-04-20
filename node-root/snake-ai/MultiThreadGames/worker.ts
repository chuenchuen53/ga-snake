import SnakeGame from "snake-game/SnakeGame";
import InputLayer from "../InputLayer";
import SnakeBrain from "../SnakeBrain";
import type { GameRecord } from "snake-game/SnakeGame";
import type { WorkerData, WorkerResult } from "./typing";

let snakeGame: SnakeGame = new SnakeGame({ worldWidth: 20, worldHeight: 20 });
let inputLayer: InputLayer = new InputLayer(snakeGame);

export default function workerFunc(workerData: WorkerData): WorkerResult {
  const { worldWidth, worldHeight, playTimes, snakeBrainPlainObject } = workerData;

  if (worldWidth !== snakeGame.worldWidth || worldHeight !== snakeGame.worldHeight) {
    snakeGame = new SnakeGame({ worldWidth, worldHeight });
    inputLayer = new InputLayer(snakeGame);
  }

  const snakeBrain = new SnakeBrain({
    inputLength: snakeBrainPlainObject.inputLength,
    layerShapes: snakeBrainPlainObject.layerShapes,
    hiddenLayerActivationFunction: snakeBrainPlainObject.hiddenLayerActivationFunction,
    providedWeightsAndBiases: {
      weights: snakeBrainPlainObject.weights,
      biases: snakeBrainPlainObject.biases,
    },
  });

  const snakeLengthArr: number[] = [];
  const movesArr: number[] = [];
  const gameRecordArr: GameRecord[] = [];

  for (let i = 0; i < playTimes; i++) {
    snakeGame.reset();
    do {
      const direction = snakeBrain.compute(inputLayer.compute());
      snakeGame.snakeMoveByDirection(direction);
    } while (!snakeGame.gameOver);

    snakeLengthArr.push(snakeGame.snake.length);
    movesArr.push(snakeGame.moves);
    gameRecordArr.push(snakeGame.exportGameRecord());
  }

  return { snakeLengthArr, movesArr, gameRecordArr };
}
