export enum ActivationFunction {
  LINEAR = "LINEAR",
  TANH = "TANH",
  RELU = "RELU",
}

function hiddenLayerActivation(x: number[], type: ActivationFunction): number[] {
  switch (type) {
    case ActivationFunction.LINEAR:
      return x;
    case ActivationFunction.TANH:
      return x.map((xx) => Math.tanh(xx));
    case ActivationFunction.RELU:
      return x.map((xx) => Math.max(0, xx));
  }
}

function multiplication(a: number[][], b: number[]) {
  return a.map((x) => x.reduce((acc, cur, idx) => acc + cur * b[idx], 0));
}

function addition(a: number[], b: number[]) {
  return a.map((x, i) => x + b[i]);
}

function computeOneLayer(W: number[][], X: number[], B: number[]): number[] {
  return addition(multiplication(W, X), B);
}

function computeMultipleLayer(Ws: number[][][], x: number[], a: number[][], hiddenLayerActivationFunction: ActivationFunction): number[] {
  const numOfLayer = Ws.length;

  let layerOutput = x;
  // hidden layer
  for (let i = 0; i < numOfLayer - 1; i++) {
    layerOutput = hiddenLayerActivation(computeOneLayer(Ws[i], layerOutput, a[i]), hiddenLayerActivationFunction);
  }

  // output layer
  layerOutput = computeOneLayer(Ws[numOfLayer - 1], layerOutput, a[numOfLayer - 1]);
  return layerOutput;
}

function indexOfMaxValueInArray(arr: number[]) {
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

function minmax(min: number, value: number, max: number) {
  return value < min ? min : value > max ? max : value;
}

function minOfArray(arr: number[]) {
  return arr.reduce((a, b) => (a < b ? a : b), arr[0]);
}

function maxOfArray(arr: number[]) {
  return arr.reduce((a, b) => (a > b ? a : b), arr[0]);
}

function meanOfArray(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function sdOfArray(arr: number[]) {
  const mean = meanOfArray(arr);
  return Math.sqrt(arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length);
}

function lowerQuartileOfArray(arr: number[]) {
  const sorted = arr.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 4);
  return sorted[mid];
}

function medianOfArray(arr: number[]) {
  const sorted = arr.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted[mid];
}

function upperQuartileOfArray(arr: number[]) {
  const sorted = arr.slice().sort((a, b) => a - b);
  const mid = Math.floor((sorted.length * 3) / 4);
  return sorted[mid];
}

function modeOfArray(arr: number[]): number | null {
  const counts = arr.reduce((a, b) => {
    a[b] = (a[b] || 0) + 1;
    return a;
  }, {});
  const maxCount = Math.max(...(Object.values(counts) as any));
  if (maxCount === 0 || maxCount === 1) {
    return null;
  }
  const modes = Object.keys(counts).filter((x) => counts[x] === maxCount);
  if (modes.length) {
    return parseFloat(modes[0]);
  } else {
    return null;
  }
}

function skewnessOfArray(arr: number[]) {
  const mean = meanOfArray(arr);
  const sd = sdOfArray(arr);
  return arr.reduce((a, b) => a + Math.pow(b - mean, 3), 0) / arr.length / Math.pow(sd, 3);
}

function kurtosisOfArray(arr: number[]) {
  const mean = meanOfArray(arr);
  const sd = sdOfArray(arr);
  return arr.reduce((a, b) => a + Math.pow(b - mean, 4), 0) / arr.length / Math.pow(sd, 4) - 3;
}

function describeArray(arr: number[]) {
  return {
    min: minOfArray(arr),
    max: maxOfArray(arr),
    mean: meanOfArray(arr),
    sd: sdOfArray(arr),
    lowerQuartile: lowerQuartileOfArray(arr),
    median: medianOfArray(arr),
    upperQuartile: upperQuartileOfArray(arr),
    mode: modeOfArray(arr),
    skewness: skewnessOfArray(arr),
    kurtosis: kurtosisOfArray(arr),
  };
}

const stats = Object.freeze({
  minOfArray,
  maxOfArray,
  meanOfArray,
  sdOfArray,
  lowerQuartileOfArray,
  medianOfArray,
  upperQuartileOfArray,
  modeOfArray,
  skewnessOfArray,
  kurtosisOfArray,
  describeArray,
});

export const CalcUtils = Object.freeze({
  multiplication,
  addition,
  computeOneLayer,
  computeMultipleLayer,
  indexOfMaxValueInArray,
  minmax,
  stats,
});
