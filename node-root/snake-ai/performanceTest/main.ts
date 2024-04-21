import * as fs from "fs";
import * as path from "path";
import SnakeGame from "snake-game/SnakeGame";
import InputLayer from "../InputLayer";
import SnakeBrain from "../SnakeBrain";
import { TimingUtils } from "./Timer";
import type { ISnakeBrain } from "../SnakeBrain";

interface Result {
  score: number;
  execTime: number;
}

function main() {
  const brainDataPath = path.join(__dirname, "trained-brain.json");
  const brainData: ISnakeBrain = JSON.parse(fs.readFileSync(brainDataPath, "utf8"));

  const snakeGame = new SnakeGame({ worldWidth: 20, worldHeight: 20 });
  const inputLayer = new InputLayer(snakeGame);
  const snakeBrain = new SnakeBrain({
    inputLength: brainData.inputLength,
    layerShapes: brainData.layerShapes,
    hiddenLayerActivationFunction: brainData.hiddenLayerActivationFunction,
    providedWeightsAndBiases: {
      weights: brainData.weights,
      biases: brainData.biases,
    },
  });

  const games = 5000;
  const result: Result[] = [];

  for (let i = 0; i < games; i++) {
    snakeGame.reset();

    const execTime = TimingUtils.execTime(() => {
      while (!snakeGame.gameOver) {
        const input = inputLayer.compute();
        const direction = snakeBrain.compute(input);
        snakeGame.snakeMoveByDirection(direction);
      }
    });

    result.push({
      score: snakeGame.snake.length,
      execTime,
    });
  }

  console.table(result);

  const totalTime = result.reduce((acc, curr) => acc + curr.execTime, 0);
  console.log(`Total time: ${totalTime.toFixed(3)}s`);

  const bestScore = result.reduce((acc, curr) => Math.max(acc, curr.score), 0);
  console.log(`Best score: ${bestScore}`);
}

main();
