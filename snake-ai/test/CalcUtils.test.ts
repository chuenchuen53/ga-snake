import { ActivationFunction, CalcUtils } from "../CalcUtils";

const M1 = [
  [0, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10, 11],
  [12, 13, 14, 15, 16, 17],
  [18, 19, 20, 21, 22, 23],
  [24, 25, 26, 27, 28, 29],
  [30, 31, 32, 33, 34, 35],
];
const M2 = [
  [10, 11, 12, 13, 14, 15],
  [16, 17, 18, 19, 110, 111],
  [112, 113, 114, 115, 116, 117],
  [118, 119, 120, 121, 122, 123],
  [124, 125, 126, 127, 128, 129],
  [130, 131, 132, 133, 134, 135],
];
const X1 = [0, 1, 2, 3, 4, 5];
const X2 = [55, 146, 237, 328, 419, 510];
const X3 = [22790, 116571, 195682, 205853, 216024, 226195];

const B1 = [0, 1, 2, 3, 4, 5];
const B2 = [10, 11, 12, 13, 14, 15];

const M1X1 = [55, 145, 235, 325, 415, 505];

const statsSampleArr1 = [-470, -386, 877, -769, -6, 799, 265, 487, -781, -360];
const statsSampleArr2 = [0.39450487, -0.10545648, -0.90960379, 0.41854961, -0.46016425, 0.50427588, 0.46510193, 0.91963169, -0.93352642, -0.55964653];

const quartileSampleArr = [6, 7, 15, 36, 39, 41, 41, 43, 43, 47, 49];

describe("CalcUtils", () => {
  test("addition", () => {
    expect(CalcUtils.addition(M1X1, B1)).toEqual(X2);
  });

  test("multiplication", () => {
    expect(CalcUtils.multiplication(M1, X1)).toStrictEqual(M1X1);
  });

  test("ComputeOneLayer", () => {
    expect(CalcUtils.computeOneLayer(M1, X1, B1)).toStrictEqual(X2);
    expect(CalcUtils.computeOneLayer(M2, X2, B2)).toStrictEqual(X3);
  });

  test("computeMultipleLayer", () => {
    expect(CalcUtils.computeMultipleLayer([M1, M2], X1, [B1, B2], ActivationFunction.LINEAR)).toStrictEqual(X3);
  });

  test("IndexOfMaxValueInArray", () => {
    expect(CalcUtils.indexOfMaxValueInArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBe(9);
    expect(CalcUtils.indexOfMaxValueInArray([6, 7, 8, 9, 10, 1, 2, 3, 4, 5])).toBe(4);
    expect(CalcUtils.indexOfMaxValueInArray([-1, -2, -3, -4, -5, -6])).toBe(0);
    expect(CalcUtils.indexOfMaxValueInArray([1, 2, 3, -1, -2, -3])).toBe(2);
  });

  test("minmax", () => {
    expect(CalcUtils.minmax(-1, 0.5, 1)).toBe(0.5);
    expect(CalcUtils.minmax(-1, 127, 1)).toBe(1);
    expect(CalcUtils.minmax(-1, -127, 1)).toBe(-1);
    expect(CalcUtils.minmax(-5, 0.5, 5)).toBe(0.5);
    expect(CalcUtils.minmax(-5, 127, 5)).toBe(5);
    expect(CalcUtils.minmax(-3, -127, 1)).toBe(-3);
  });

  test("stats.minOfArray", () => {
    expect(CalcUtils.stats.minOfArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBe(1);
    expect(CalcUtils.stats.minOfArray([6, 7, 8, 9, 10, 1, 2, 3, 4, 5])).toBe(1);
    expect(CalcUtils.stats.minOfArray([-6, -7, -8, -9, -10, -1, -2, -3, -4, -5])).toBe(-10);
    expect(CalcUtils.stats.minOfArray(statsSampleArr1)).toBe(-781);
    expect(CalcUtils.stats.minOfArray(statsSampleArr2)).toBe(-0.93352642);
  });

  test("stats.maxOfArray", () => {
    expect(CalcUtils.stats.maxOfArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBe(10);
    expect(CalcUtils.stats.maxOfArray([6, 7, 8, 9, 10, 1, 2, 3, 4, 5])).toBe(10);
    expect(CalcUtils.stats.maxOfArray([-6, -7, -8, -9, -10, -1, -2, -3, -4, -5])).toBe(-1);
    expect(CalcUtils.stats.maxOfArray(statsSampleArr1)).toBe(877);
    expect(CalcUtils.stats.maxOfArray(statsSampleArr2)).toBe(0.91963169);
  });

  test("stats.meanOfArray", () => {
    expect(CalcUtils.stats.meanOfArray(statsSampleArr1)).toBeCloseTo(-34.4);
    expect(CalcUtils.stats.meanOfArray(statsSampleArr2)).toBeCloseTo(-0.026633349);
  });

  test("stats.sdOfArray", () => {
    expect(CalcUtils.stats.sdOfArray(statsSampleArr1)).toBeCloseTo(583.433320954503);
    expect(CalcUtils.stats.sdOfArray(statsSampleArr2)).toBeCloseTo(0.6224940164933749);
  });

  test("stats.lowerQuartileOfArray", () => {
    expect(CalcUtils.stats.lowerQuartileOfArray(quartileSampleArr)).toBeCloseTo(15);
    expect(CalcUtils.stats.lowerQuartileOfArray(statsSampleArr1)).toBeCloseTo(-470);
    expect(CalcUtils.stats.lowerQuartileOfArray(statsSampleArr2)).toBeCloseTo(-0.55964653);
  });

  test("stats.medianOfArray", () => {
    expect(CalcUtils.stats.medianOfArray(quartileSampleArr)).toBeCloseTo(41);
    expect(CalcUtils.stats.medianOfArray(statsSampleArr1)).toBeCloseTo(-6);
    expect(CalcUtils.stats.medianOfArray(statsSampleArr2)).toBeCloseTo(0.39450487);
  });

  test("stats.upperQuartileOfArray", () => {
    expect(CalcUtils.stats.upperQuartileOfArray(quartileSampleArr)).toBeCloseTo(43);
    expect(CalcUtils.stats.upperQuartileOfArray(statsSampleArr1)).toBeCloseTo(487);
    expect(CalcUtils.stats.upperQuartileOfArray(statsSampleArr2)).toBeCloseTo(0.46510193);
  });

  test("stats.skewnessOfArray", () => {
    expect(CalcUtils.stats.skewnessOfArray(statsSampleArr1)).toBeCloseTo(0.26751891981020914);
    expect(CalcUtils.stats.skewnessOfArray(statsSampleArr2)).toBeCloseTo(-0.16122713469950117);
  });

  test("stats.kurtosisOfArray", () => {
    expect(CalcUtils.stats.kurtosisOfArray(statsSampleArr1)).toBeCloseTo(-1.3440077183584165);
    expect(CalcUtils.stats.kurtosisOfArray(statsSampleArr2)).toBeCloseTo(-1.3944844118598168);
  });
});
