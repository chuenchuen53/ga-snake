import Utils from "snake-game/Utils";
import { Direction } from "snake-game/typing";
import CalcUtils from "./CalcUtils";
import type { ActivationFunction } from "./CalcUtils";

export type LayerShape = [number, number];

export interface ProvidedWeightsAndBiases {
  weights: number[][][];
  biases: number[][];
}

export interface Options {
  inputLength: number;
  layerShapes: LayerShape[];
  hiddenLayerActivationFunction: ActivationFunction;
  providedWeightsAndBiases?: ProvidedWeightsAndBiases;
}

export interface ISnakeBrain {
  inputLength: number;
  layerShapes: LayerShape[];
  readonly hiddenLayerActivationFunction: ActivationFunction;
  weights: number[][][];
  biases: number[][];
}

export default class SnakeBrain implements ISnakeBrain {
  public static readonly OUTPUT_LAYER_LENGTH = 4;

  public static readonly actionMap = Object.freeze({
    0: Direction.UP,
    1: Direction.DOWN,
    2: Direction.LEFT,
    3: Direction.RIGHT,
  }) satisfies Record<number, Direction>;

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
  public weights: number[][][];
  public biases: number[][];

  constructor(options: Options) {
    this.inputLength = options.inputLength;
    this.layerShapes = options.layerShapes;
    this.hiddenLayerActivationFunction = options.hiddenLayerActivationFunction;
    if (!this.validateLayerShapes()) throw new Error("Invalid layer shapes");

    if (options.providedWeightsAndBiases) {
      this.weights = Utils.clone3DArr(options.providedWeightsAndBiases.weights);
      this.biases = Utils.clone2DArr(options.providedWeightsAndBiases.biases);
      if (!this.validateWeightsAndBiases()) throw new Error("Invalid provided weight and bias");
    } else {
      this.weights = this.layerShapes.map((x) => this.generateRandomLayerWeight(x));
      this.biases = this.layerShapes.map((x) => this.generateRandomLayerBias(x));
    }
  }

  public toPlainObject(): ISnakeBrain {
    return {
      inputLength: this.inputLength,
      layerShapes: this.layerShapes,
      hiddenLayerActivationFunction: this.hiddenLayerActivationFunction,
      weights: Utils.clone3DArr(this.weights),
      biases: Utils.clone2DArr(this.biases),
    };
  }

  public validateWeightsAndBiases(): boolean {
    if (this.weights.length === 0 || this.biases.length === 0) return false;
    if (this.weights.length !== this.biases.length) return false;
    if (this.weights.length !== this.layerShapes.length) return false;
    if (this.weights[0][0].length !== this.inputLength) return false;
    if (this.weights[this.weights.length - 1].length !== SnakeBrain.OUTPUT_LAYER_LENGTH) return false;
    if (!this.weights.flat(2).every((x) => x >= SnakeBrain.MIN_WEIGHT && x <= SnakeBrain.MAX_WEIGHT)) return false;
    if (!this.biases.flat(2).every((x) => x >= SnakeBrain.MIN_BIAS && x <= SnakeBrain.MAX_BIAS)) return false;

    for (let i = 1; i < this.weights.length; i++) {
      if (this.weights[i].length !== this.layerShapes[i][0]) return false;
      if (this.weights[i][0].length !== this.layerShapes[i][1]) return false;
    }

    for (let i = 0; i < this.biases.length; i++) {
      if (this.biases[i].length !== this.layerShapes[i][0]) return false;
    }

    return true;
  }

  public compute(input: number[]): Direction {
    const output = CalcUtils.computeMultipleLayer(this.weights, input, this.biases, this.hiddenLayerActivationFunction);
    const index = CalcUtils.indexOfMaxValueInArray(output);
    return SnakeBrain.actionMap[index];
  }

  public crossOver(a: SnakeBrain, b: SnakeBrain): void {
    for (let layerIndex = 0; layerIndex < this.weights.length; layerIndex++) {
      const weight = this.weights[layerIndex];
      const bias = this.biases[layerIndex];

      for (let row = 0; row < weight.length; row++) {
        for (let col = 0; col < weight[row].length; col++) {
          weight[row][col] = SnakeBrain.crossOverNumber(a.weights[layerIndex][row][col], b.weights[layerIndex][row][col]);
        }

        bias[row] = SnakeBrain.crossOverNumber(a.biases[layerIndex][row], b.biases[layerIndex][row]);
      }
    }
  }

  public mutate(mutationRate: number, mutationAmount: number): void {
    for (let layerIndex = 0; layerIndex < this.weights.length; layerIndex++) {
      const weight = this.weights[layerIndex];
      const bias = this.biases[layerIndex];

      for (let row = 0; row < weight.length; row++) {
        for (let col = 0; col < weight[row].length; col++) {
          if (Utils.randomBool(mutationRate)) {
            const newValue = weight[row][col] + Utils.randomUniform(-mutationAmount, mutationAmount);
            weight[row][col] = CalcUtils.minmax(SnakeBrain.MIN_WEIGHT, newValue, SnakeBrain.MAX_WEIGHT);
          }
        }

        if (Utils.randomBool(mutationRate)) {
          const newValue = bias[row] + Utils.randomUniform(-mutationAmount, mutationAmount);
          bias[row] = CalcUtils.minmax(SnakeBrain.MIN_BIAS, newValue, SnakeBrain.MAX_BIAS);
        }
      }
    }
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

  private generateRandomLayerBias(layerShape: LayerShape): number[] {
    const [row, _] = layerShape;
    const template: number[] = Array(row).fill(null);
    return template.map((_) => Utils.randomUniform(SnakeBrain.MIN_BIAS, SnakeBrain.MAX_BIAS));
  }
}
