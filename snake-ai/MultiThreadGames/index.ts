import path from "path";
import Piscina from "piscina";
import type SnakeBrain from "../SnakeBrain";
import type { WorkerData, WorkerResult } from "./typing";

export default class MultiThreadGames {
  private piscina: Piscina;

  constructor(numOfThreads: number) {
    this.piscina = new Piscina({
      filename: path.resolve(__dirname, "./worker.js"),
      minThreads: numOfThreads,
      maxThreads: numOfThreads,
    });
  }

  public async playGames(worldWidth: number, worldHeight: number, playTimes: number, snakeBrain: SnakeBrain): Promise<WorkerResult> {
    const workerData: WorkerData = {
      worldWidth,
      worldHeight,
      playTimes,
      snakeBrainPlainObject: snakeBrain.toPlainObject(),
    };
    return await this.piscina.run(workerData);
  }

  public async destroy(): Promise<void> {
    await this.piscina.destroy();
  }
}
