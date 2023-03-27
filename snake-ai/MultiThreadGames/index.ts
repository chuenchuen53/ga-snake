import path from "path";
import Piscina from "piscina";
import type { ISnakeBrain } from "../SnakeBrain";
import type { WorkerData, WorkerResult } from "./typing";

export default class MultiThreadGames {
  private piscina: Piscina;

  constructor(numOfThreads: number) {
    this.piscina = new Piscina({
      filename: path.resolve(__dirname, "./worker.js"),
      minThreads: numOfThreads,
      maxThreads: numOfThreads,
      resourceLimits: {
        maxOldGenerationSizeMb: 150,
        maxYoungGenerationSizeMb: 75,
      },
    });
  }

  public async playGames(worldWidth: number, worldHeight: number, playTimes: number, snakeBrainPlainObject: ISnakeBrain): Promise<WorkerResult> {
    const workerData: WorkerData = {
      worldWidth,
      worldHeight,
      playTimes,
      snakeBrainPlainObject,
    };
    return await this.piscina.run(workerData);
  }

  public async destroy(): Promise<void> {
    await this.piscina.destroy();
  }
}
