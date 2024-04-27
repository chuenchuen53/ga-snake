export enum ActivationFunction {
  LINEAR = "LINEAR",
  TANH = "TANH",
  RELU = "RELU",
}

export interface BaseStats {
  min: number;
  max: number;
  mean: number;
  sd: number;
  lowerQuartile: number;
  median: number;
  upperQuartile: number;
}

export default class CalcUtils {
  public static hiddenLayerActivation(x: number[], type: ActivationFunction): number[] {
    switch (type) {
      case ActivationFunction.LINEAR:
        return x;
      case ActivationFunction.TANH:
        return x.map((xx) => Math.tanh(xx));
      case ActivationFunction.RELU:
        return x.map((xx) => Math.max(0, xx));
    }
  }

  public static addition(a: number[], b: number[]) {
    return a.map((x, i) => x + b[i]);
  }

  public static multiplication(a: number[][], b: number[]) {
    return a.map((x) => x.reduce((acc, cur, idx) => acc + cur * b[idx], 0));
  }

  public static computeOneLayer(W: number[][], X: number[], B: number[]): number[] {
    return CalcUtils.addition(CalcUtils.multiplication(W, X), B);
  }

  public static computeMultipleLayer(Ws: number[][][], X: number[], Bs: number[][], hiddenLayerActivationFunction: ActivationFunction): number[] {
    const numOfLayer = Ws.length;

    let layerOutput = X;
    // hidden layer
    for (let i = 0; i < numOfLayer - 1; i++) {
      layerOutput = CalcUtils.hiddenLayerActivation(CalcUtils.computeOneLayer(Ws[i], layerOutput, Bs[i]), hiddenLayerActivationFunction);
    }

    // output layer
    layerOutput = CalcUtils.computeOneLayer(Ws[numOfLayer - 1], layerOutput, Bs[numOfLayer - 1]);
    return layerOutput;
  }

  public static indexOfMaxValueInArray(arr: number[]) {
    if (arr.length === 0) return -1;
    let max = arr[0];
    let maxIndex = 0;
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
        max = arr[i];
        maxIndex = i;
      }
    }
    return maxIndex;
  }

  public static minmax(min: number, value: number, max: number) {
    return value < min ? min : value > max ? max : value;
  }

  public static minOfArray(arr: number[]) {
    return arr.reduce((a, b) => (a < b ? a : b), arr[0]);
  }

  public static maxOfArray(arr: number[]) {
    return arr.reduce((a, b) => (a > b ? a : b), arr[0]);
  }

  public static meanOfArray(arr: number[]) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  public static sdOfArray(arr: number[]) {
    const mean = CalcUtils.meanOfArray(arr);
    return Math.sqrt(arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length);
  }

  public static lowerQuartileOfArray(arr: number[]) {
    const sorted = arr.slice().sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 4);
    return sorted[mid];
  }

  public static medianOfArray(arr: number[]) {
    const sorted = arr.slice().sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted[mid];
  }

  public static upperQuartileOfArray(arr: number[]) {
    const sorted = arr.slice().sort((a, b) => a - b);
    const mid = Math.floor((sorted.length * 3) / 4);
    return sorted[mid];
  }

  public static statsOfArray(arr: number[]): BaseStats {
    return {
      min: CalcUtils.minOfArray(arr),
      max: CalcUtils.maxOfArray(arr),
      mean: CalcUtils.meanOfArray(arr),
      sd: CalcUtils.sdOfArray(arr),
      lowerQuartile: CalcUtils.lowerQuartileOfArray(arr),
      median: CalcUtils.medianOfArray(arr),
      upperQuartile: CalcUtils.upperQuartileOfArray(arr),
    };
  }

  public static binarySearch(prefixSum: number[], value: number): number {
    let low = 0;
    let high = prefixSum.length - 1;
    while (low < high) {
      const mid = low + Math.floor((high - low) / 2);
      if (prefixSum[mid] >= value) {
        high = mid;
      } else {
        low = mid + 1;
      }
    }
    return low;
  }
}
