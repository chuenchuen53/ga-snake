// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callable<P extends any[], T> = (...args: P) => T;

export class TimingUtils {
  public static execTime(fn: Callable<any, any>): number {
    const startTime = process.hrtime();
    fn();
    const endTime = process.hrtime(startTime);
    const elapsed = endTime[0] + endTime[1] / 1e9;
    return elapsed;
  }
}
