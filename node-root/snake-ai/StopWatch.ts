export class StopWatch {
  private startTime: number;
  private stopTime: number;
  private totalTime: number;

  constructor() {
    this.startTime = 0;
    this.stopTime = 0;
    this.totalTime = 0;
  }

  public get totalTimeSpent() {
    return this.totalTime;
  }

  public start() {
    this.startTime = new Date().getTime();
  }

  public stop() {
    this.stopTime = new Date().getTime();
    this.totalTime += this.stopTime - this.startTime;
  }
}
