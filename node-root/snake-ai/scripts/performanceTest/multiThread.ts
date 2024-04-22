import * as fs from "fs";
import * as path from "path";
import SnakeBrain from "../../SnakeBrain";
import MultiThreadGames from "../../MultiThreadGames";
import CalcUtils from "../../CalcUtils";
import { TimingUtils } from "./Timer";
import type { ISnakeBrain } from "../../SnakeBrain";

async function main() {
  const brainDataPath = path.join(__dirname, "trained-brain.json");
  const brainData: ISnakeBrain = JSON.parse(fs.readFileSync(brainDataPath, "utf8"));

  const snakeBrain = new SnakeBrain({
    inputLength: brainData.inputLength,
    layerShapes: brainData.layerShapes,
    hiddenLayerActivationFunction: brainData.hiddenLayerActivationFunction,
    providedWeightsAndBiases: {
      weights: brainData.weights,
      biases: brainData.biases,
    },
  });

  const multiThreadGames = new MultiThreadGames(10);

  const games = 10000;
  const brains = Array.from({ length: games }, () => snakeBrain);
  let score: number[] = [];

  const execTime = await TimingUtils.execTime(async () => {
    const resultPromise = brains.map((brain) => multiThreadGames.playGames(20, 20, 1, brain.toPlainObject()));
    const workerResults = await Promise.all(resultPromise);
    score = workerResults.map((x) => CalcUtils.meanOfArray(x.snakeLengthArr));
  });

  const totalTime = execTime;
  console.log(`Total time: ${totalTime.toFixed(3)}s`);

  const bestScore = Math.max(...score);
  console.log(`Best score: ${bestScore}`);

  const avgScore = CalcUtils.meanOfArray(score);
  console.log(`Average score: ${avgScore.toFixed(2)}`);

  multiThreadGames.destroy();
}

main();
