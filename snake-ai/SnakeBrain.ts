import { Utils } from "snake-game/utils";
import { Direction } from "snake-game/typing";
import { CalcUtils } from "./CalcUtils";
import type { ActivationFunction } from "./CalcUtils";

export type LayerShape = number[];

interface ProvidedWeightAndBias {
  weightArr: number[][][];
  biasesArr: number[][];
}

interface Options {
  inputLength: number;
  layerShapes: LayerShape[];
  hiddenLayerActivationFunction: ActivationFunction;
  providedWeightAndBias?: ProvidedWeightAndBias;
}

export interface ISnakeBrain {
  inputLength: number;
  layerShapes: LayerShape[];
  readonly hiddenLayerActivationFunction: ActivationFunction;
  weightArr: number[][][];
  biasesArr: number[][];
}

export default class SnakeBrain implements ISnakeBrain {
  public static readonly OUTPUT_LAYER_LENGTH = 4;

  public static readonly actionMap = Object.freeze({
    0: Direction.UP,
    1: Direction.DOWN,
    2: Direction.LEFT,
    3: Direction.RIGHT,
  }) satisfies Record<string, Direction>;

  private static readonly MIN_WEIGHT = -1;
  private static readonly MAX_WEIGHT = 1;
  private static readonly MIN_BIAS = -1;
  private static readonly MAX_BIAS = 1;

  public static crossOverNumber(a: number, b: number): number {
    return Math.random() < 0.5 ? a : b;
  }

  public inputLength: number;
  public layerShapes: LayerShape[];
  public readonly hiddenLayerActivationFunction: ActivationFunction;
  public weightArr: number[][][];
  public biasesArr: number[][];

  constructor(options: Options) {
    this.inputLength = options.inputLength;
    this.layerShapes = options.layerShapes;
    this.hiddenLayerActivationFunction = options.hiddenLayerActivationFunction;
    if (!this.validateLayerShapes()) throw new Error("Invalid layer shapes");

    if (options.providedWeightAndBias) {
      this.weightArr = Utils.cloneObject(options.providedWeightAndBias.weightArr);
      this.biasesArr = Utils.cloneObject(options.providedWeightAndBias.biasesArr);
      if (!this.validateWeightAndBias()) throw new Error("Invalid provided weight and bias");
    } else {
      this.weightArr = this.layerShapes.map((x) => this.generateRandomLayerWeight(x));
      this.biasesArr = this.layerShapes.map((x) => this.generateRandomLayerBiases(x));
    }
  }

  public toPlainObject(): ISnakeBrain {
    return {
      inputLength: this.inputLength,
      layerShapes: this.layerShapes,
      hiddenLayerActivationFunction: this.hiddenLayerActivationFunction,
      weightArr: this.weightArr,
      biasesArr: this.biasesArr,
    };
  }

  public validateWeightAndBias(): boolean {
    if (this.weightArr.length === 0 || this.biasesArr.length === 0) return false;
    if (this.weightArr.length !== this.biasesArr.length) return false;
    if (this.weightArr.length !== this.layerShapes.length) return false;
    if (this.weightArr[0][0].length !== this.inputLength) return false;
    if (this.weightArr[this.weightArr.length - 1].length !== SnakeBrain.OUTPUT_LAYER_LENGTH) return false;
    if (!this.weightArr.flat(2).every((x) => x >= SnakeBrain.MIN_WEIGHT && x <= SnakeBrain.MAX_WEIGHT)) return false;
    if (!this.biasesArr.flat(2).every((x) => x >= SnakeBrain.MIN_BIAS && x <= SnakeBrain.MAX_BIAS)) return false;

    for (let i = 1; i < this.weightArr.length; i++) {
      if (this.weightArr[i].length !== this.layerShapes[i][0]) return false;
      if (this.weightArr[i][0].length !== this.layerShapes[i][1]) return false;
    }

    for (let i = 0; i < this.biasesArr.length; i++) {
      if (this.biasesArr[i].length !== this.layerShapes[i][0]) return false;
    }

    return true;
  }

  public compute(input: number[]): Direction {
    const output = CalcUtils.computeMultipleLayer(this.weightArr, input, this.biasesArr, this.hiddenLayerActivationFunction);
    const index = CalcUtils.indexOfMaxValueInArray(output);
    return this.getAction(index);
  }

  public crossOver(a: SnakeBrain, b: SnakeBrain): void {
    for (let layerIndex = 0; layerIndex < this.weightArr.length; layerIndex++) {
      const weight = this.weightArr[layerIndex];
      const biases = this.biasesArr[layerIndex];

      for (let row = 0; row < weight.length; row++) {
        for (let col = 0; col < weight[row].length; col++) {
          weight[row][col] = SnakeBrain.crossOverNumber(a.weightArr[layerIndex][row][col], b.weightArr[layerIndex][row][col]);
        }

        biases[row] = SnakeBrain.crossOverNumber(a.biasesArr[layerIndex][row], b.biasesArr[layerIndex][row]);
      }
    }
  }

  public mutate(mutationRate: number, mutationAmount: number): void {
    for (let layerIndex = 0; layerIndex < this.weightArr.length; layerIndex++) {
      const weight = this.weightArr[layerIndex];
      const biases = this.biasesArr[layerIndex];

      for (let row = 0; row < weight.length; row++) {
        for (let col = 0; col < weight[row].length; col++) {
          if (Utils.randomBool(mutationRate)) {
            const newValue = weight[row][col] + Utils.randomUniform(-mutationAmount, mutationAmount);
            weight[row][col] = CalcUtils.minmax(SnakeBrain.MIN_WEIGHT, newValue, SnakeBrain.MAX_WEIGHT);
          }
        }

        if (Utils.randomBool(mutationRate)) {
          const newValue = biases[row] + Utils.randomUniform(-mutationAmount, mutationAmount);
          biases[row] = CalcUtils.minmax(SnakeBrain.MIN_BIAS, newValue, SnakeBrain.MAX_BIAS);
        }
      }
    }
  }

  public exportBrainToJson(): string {
    return JSON.stringify(this);
  }

  private validateLayerShapes(): boolean {
    const numOfLayer = this.layerShapes.length;

    if (numOfLayer < 1) return false;

    if (this.layerShapes[0][1] !== this.inputLength) return false;

    if (this.layerShapes[numOfLayer - 1][0] !== SnakeBrain.OUTPUT_LAYER_LENGTH) return false;

    for (let i = 1; i < numOfLayer; i++) {
      if (this.layerShapes[i][1] !== this.layerShapes[i - 1][0]) return false;
    }

    return true;
  }

  private generateRandomLayerWeight(layerShape: LayerShape): number[][] {
    const [row, col] = layerShape;
    const template: number[][] = Array(row)
      .fill(null)
      .map(() => Array(col).fill(null));
    return template.map((x) => x.map((_) => Utils.randomUniform(SnakeBrain.MIN_WEIGHT, SnakeBrain.MAX_WEIGHT)));
  }

  private generateRandomLayerBiases(layerShape: LayerShape): number[] {
    const [row, _] = layerShape;
    const template: number[] = Array(row).fill(null);
    return template.map((_) => Utils.randomUniform(SnakeBrain.MIN_BIAS, SnakeBrain.MAX_BIAS));
  }

  private getAction(index: number): Direction {
    return SnakeBrain.actionMap[index];
  }
}
