import SnakeGame from "snake-game/SnakeGame";
import InputLayer from "../InputLayer";
import SnakeBrain from "../SnakeBrain";
import type { WorkerData, WorkerResult } from "./typing";

let snakeGame: SnakeGame = new SnakeGame({ worldWidth: 20, worldHeight: 20 });
let inputLayer: InputLayer = new InputLayer(snakeGame);

export default async function workerFunc(workerData: WorkerData): Promise<WorkerResult> {
  const { worldWidth, worldHeight, playTimes, snakeBrainPlainObject } = workerData;

  if (worldWidth !== snakeGame.worldWidth || worldHeight !== snakeGame.worldHeight) {
    snakeGame = new SnakeGame({ worldWidth, worldHeight });
    inputLayer = new InputLayer(snakeGame);
  }

  const snakeBrain = new SnakeBrain({
    inputLength: snakeBrainPlainObject.inputLength,
    layerShapes: snakeBrainPlainObject.layerShapes,
    hiddenLayerActivationFunction: snakeBrainPlainObject.hiddenLayerActivationFunction,
    providedWeightAndBias: {
      weightArr: snakeBrainPlainObject.weightArr,
      biasesArr: snakeBrainPlainObject.biasesArr,
    },
  });

  const snakeLengthArr: number[] = [];
  const movesArr: number[] = [];
  const gameRecordArr: string[] = [];

  for (let i = 0; i < playTimes; i++) {
    snakeGame.reset();
    do {
      const direction = snakeBrain.compute(inputLayer.compute());
      snakeGame.snakeMoveByDirection(direction);
    } while (!snakeGame.gameOver);

    snakeLengthArr.push(snakeGame.snake.positions.length);
    movesArr.push(snakeGame.moves);
    gameRecordArr.push(snakeGame.gameRecord);
  }

  return { snakeLengthArr, movesArr, gameRecordArr };
}
