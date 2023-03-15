import type { ISnakeBrain } from "../SnakeBrain";

export interface WorkerData {
  worldWidth: number;
  worldHeight: number;
  playTimes: number;
  snakeBrainPlainObject: ISnakeBrain;
}

export interface WorkerResult {
  snakeLengthArr: number[];
  movesArr: number[];
  gameRecordArr: string[];
}
