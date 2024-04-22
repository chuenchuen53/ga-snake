export class TimingUtils {
  public static async execTime(fn: () => Promise<void>): Promise<number> {
    const startTime = process.hrtime();
    await fn();
    const endTime = process.hrtime(startTime);
    const elapsed = endTime[0] + endTime[1] / 1e9;
    return elapsed;
  }
}
