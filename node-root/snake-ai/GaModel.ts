import Utils from "snake-game/Utils";
import SnakeGame from "snake-game/SnakeGame";
import InputLayer from "./InputLayer";
import CalcUtils from "./CalcUtils";
import SnakeBrain from "./SnakeBrain";
import MultiThreadGames from "./MultiThreadGames";
import type { ISnakeBrain, LayerShape } from "./SnakeBrain";
import type { ActivationFunction, BaseStats } from "./CalcUtils";
import type { GameRecord } from "snake-game/SnakeGame";

export interface Options {
  worldWidth: number;
  worldHeight: number;
  snakeBrainConfig: {
    hiddenLayersLength: number[];
    hiddenLayerActivationFunction: ActivationFunction;
  };
  gaConfig: {
    populationSize: number;
    surviveRate: number;
    populationMutationRate: number;
    geneMutationRate: number;
    mutationAmount: number;
    trialTimes: number;
  };
  providedInfo?: {
    generation: number;
    snakeBrains: ISnakeBrain[];
  };
}

export interface Individual {
  snakeBrain: SnakeBrain;
  snakeLength: number;
  moves: number;
  fitness: number;
  survive: boolean;
  gameRecord: GameRecord | null;
}

export type IndividualPlainObject = Omit<Individual, "snakeBrain"> & { snakeBrain: ISnakeBrain };

export type Population = Individual[];

export interface EvolveResult {
  generation: number;
  bestIndividual: IndividualPlainObject;
  timeSpent: number;
  overallStats: {
    fitness: BaseStats;
    snakeLength: BaseStats;
    moves: BaseStats;
  };
}

export interface IGaModel {
  worldWidth: number;
  worldHeight: number;
  hiddenLayersLength: number[];
  hiddenLayerActivationFunction: ActivationFunction;
  populationSize: number;
  surviveRate: number;
  populationMutationRate: number;
  geneMutationRate: number;
  mutationAmount: number;
  trialTimes: number;
  generation: number;
  population: IndividualPlainObject[];
}

export default class GaModel implements IGaModel {
  public static generateLayerShape(...args: number[]) {
    const shapes: LayerShape[] = [];
    for (let i = 0; i < args.length - 1; i++) {
      shapes.push([args[i + 1], args[i]]);
    }
    return shapes;
  }

  public static fitness(moves: number, snakeLength: number, maxPossibleSnakeLength: number): number {
    if (snakeLength === 1) return 0;

    const ratioOfLength = snakeLength / maxPossibleSnakeLength;

    // for short snake
    const moveScore = moves * 10;
    const cyclicPenalty = moves * 6 * (1 - ratioOfLength) ** 2;

    // for long snake
    const lengthScore = (snakeLength - 1) ** (2 + 6 * ratioOfLength) * maxPossibleSnakeLength * moves;

    return moveScore - cyclicPenalty + lengthScore;
  }

  public static spinRouletteWheel(options: Individual[]): Individual {
    const totalScore = options.reduce((acc, option) => acc + option.fitness, 0);
    let randomNum = Math.random() * totalScore;
    for (let i = 0; i < options.length; i++) {
      if (randomNum < options[i].fitness) {
        return options[i];
      }
      randomNum -= options[i].fitness;
    }
    return options[options.length - 1];
  }

  public readonly worldWidth: number;
  public readonly worldHeight: number;
  public readonly hiddenLayersLength: number[];
  public readonly hiddenLayerActivationFunction: ActivationFunction;
  public readonly populationSize: number;
  public readonly surviveRate: number;
  public readonly populationMutationRate: number;
  public readonly geneMutationRate: number;
  public readonly mutationAmount: number;
  public readonly trialTimes: number;
  public readonly population: Population;

  private _generation: number;
  private _evolving: boolean;
  private readonly _numberOfSurvival: number;
  private readonly _maxPossibleSnakeLength: number;
  private readonly multiThreadGames: MultiThreadGames;

  constructor(option: Options, numOfThreads: number) {
    this.worldHeight = option.worldHeight;
    this.worldWidth = option.worldWidth;
    this.hiddenLayersLength = option.snakeBrainConfig.hiddenLayersLength;
    this.hiddenLayerActivationFunction = option.snakeBrainConfig.hiddenLayerActivationFunction;
    this.populationSize = option.gaConfig.populationSize;
    this.surviveRate = option.gaConfig.surviveRate;
    this.populationMutationRate = option.gaConfig.populationMutationRate;
    this.geneMutationRate = option.gaConfig.geneMutationRate;
    this.mutationAmount = option.gaConfig.mutationAmount;
    this.trialTimes = option.gaConfig.trialTimes;

    const inputLayerLength = InputLayer.INPUT_LAYER_LENGTH;
    const layerShapes = GaModel.generateLayerShape(inputLayerLength, ...this.hiddenLayersLength, SnakeBrain.OUTPUT_LAYER_LENGTH);

    if (option.providedInfo) {
      const { generation, snakeBrains } = option.providedInfo;
      if (this.populationSize !== snakeBrains.length) throw Error("Provided snake brains length not equal to population size.");
      this._generation = generation;
      this.population = snakeBrains.map((x) => ({
        snakeBrain: new SnakeBrain({
          inputLength: x.inputLength,
          layerShapes: x.layerShapes,
          hiddenLayerActivationFunction: x.hiddenLayerActivationFunction,
          providedWeightsAndBiases: {
            weights: x.weights,
            biases: x.biases,
          },
        }),
        fitness: 0,
        snakeLength: 1,
        moves: 0,
        survive: true,
        gameRecord: null,
      }));
    } else {
      this._generation = -1;
      this.population = Array(this.populationSize)
        .fill(null)
        .map(() => ({
          snakeBrain: new SnakeBrain({
            inputLength: inputLayerLength,
            layerShapes,
            hiddenLayerActivationFunction: this.hiddenLayerActivationFunction,
          }),
          fitness: 0,
          snakeLength: 1,
          moves: 0,
          survive: true,
          gameRecord: null,
        }));
    }

    this._evolving = false;
    this.multiThreadGames = new MultiThreadGames(numOfThreads);
    this._numberOfSurvival = Math.floor(this.populationSize * this.surviveRate);
    if (this._numberOfSurvival < 2) throw Error("Survival less than 2, please increase survive rate or population size.");
    this._maxPossibleSnakeLength = this.worldHeight * this.worldWidth;
  }

  public get generation() {
    return this._generation;
  }

  public get evolving(): boolean {
    return this._evolving;
  }

  public exportModel(): IGaModel {
    return {
      worldWidth: this.worldWidth,
      worldHeight: this.worldHeight,
      hiddenLayersLength: this.hiddenLayersLength,
      hiddenLayerActivationFunction: this.hiddenLayerActivationFunction,
      populationSize: this.populationSize,
      surviveRate: this.surviveRate,
      populationMutationRate: this.populationMutationRate,
      geneMutationRate: this.geneMutationRate,
      mutationAmount: this.mutationAmount,
      trialTimes: this.trialTimes,
      generation: this.generation,
      population: this.population.map((x) => ({
        snakeBrain: x.snakeBrain.toPlainObject(),
        fitness: x.fitness,
        snakeLength: x.snakeLength,
        moves: x.moves,
        survive: x.survive,
        gameRecord: x.gameRecord ? SnakeGame.cloneGameRecord(x.gameRecord) : null,
      })),
    };
  }

  public async evolve(): Promise<EvolveResult> {
    if (this._evolving) throw Error("Evolve is still running.");

    this._generation++;
    this._evolving = true;
    const startTime = new Date().getTime();

    await this.evaluate();
    this.select();
    this.crossover();
    this.mutate();

    const generation = this.generation;
    const finalBestPlayer = this.population[0];

    const bestIndividual: IndividualPlainObject = {
      snakeBrain: finalBestPlayer.snakeBrain.toPlainObject(),
      fitness: finalBestPlayer.fitness,
      snakeLength: finalBestPlayer.snakeLength,
      moves: finalBestPlayer.moves,
      survive: finalBestPlayer.survive,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- gameRecord will not be null after evaluate()
      gameRecord: SnakeGame.cloneGameRecord(finalBestPlayer.gameRecord!),
    };

    const overallStats = {
      fitness: CalcUtils.statsOfArray(this.population.map((x) => x.fitness)),
      snakeLength: CalcUtils.statsOfArray(this.population.map((x) => x.snakeLength)),
      moves: CalcUtils.statsOfArray(this.population.map((x) => x.moves)),
    };

    const timeSpent = new Date().getTime() - startTime;
    this._evolving = false;

    return { generation, bestIndividual, timeSpent, overallStats };
  }

  public async destroy(): Promise<void> {
    if (this._evolving) throw Error("Evolve is still running.");
    await this.multiThreadGames.destroy();
  }

  private async evaluate(): Promise<void> {
    const promises = this.population.map((p) => this.multiThreadGames.playGames(this.worldWidth, this.worldHeight, this.trialTimes, p.snakeBrain.toPlainObject()));
    const result = await Promise.all(promises);

    for (let i = 0; i < this.population.length; i++) {
      const p = this.population[i];
      const { snakeLengthArr, movesArr, gameRecordArr } = result[i];
      const fitnessArr: number[] = new Array(this.trialTimes).fill(0).map((_, j) => GaModel.fitness(movesArr[j], snakeLengthArr[j], this._maxPossibleSnakeLength));

      p.snakeLength = CalcUtils.meanOfArray(snakeLengthArr);
      p.moves = CalcUtils.meanOfArray(movesArr);
      p.fitness = CalcUtils.meanOfArray(fitnessArr);
      p.gameRecord = gameRecordArr[CalcUtils.indexOfMaxValueInArray(fitnessArr)];
    }
  }

  private select() {
    // sort descending (highest fitness first)
    this.population.sort((a, b) => b.fitness - a.fitness);
    this.population.forEach((p, index) => {
      p.survive = index < this._numberOfSurvival;
    });
  }

  private crossover() {
    this.population.forEach((p, childIdx) => {
      if (this.population[childIdx].survive) return;

      const parent1 = this.pickParent(childIdx);
      const parent2 = this.pickParent(childIdx, parent1);
      p.snakeBrain.crossOver(parent1.snakeBrain, parent2.snakeBrain);
    });
  }

  private pickParent(childIdx: number, anotherParent?: Individual): Individual {
    const anotherParentIdx = anotherParent ? this.population.findIndex((p) => p === anotherParent) : -1;
    const filteredPopulation = this.population.filter((p, idx) => idx !== childIdx && idx !== anotherParentIdx);
    return GaModel.spinRouletteWheel(filteredPopulation);
  }

  private mutate() {
    const best5PercentIndex = Math.floor(this._numberOfSurvival * 0.05);

    // e.g. assume populationMutationRate be 0.5, population size be 100, target mutation is 50
    // protect the best 5% from mutating -> 95 * 0.5 / 0.95 = 50
    // the formula is
    // ((p * 0.95) * x) / p = r
    // x = r / 0.95
    // where p is population size, x is population mutation rate, r is target mutation rate
    const mutationRateForRand = this.populationMutationRate / 0.95;

    this.population.forEach((p, index) => {
      // prevent the best 5% from mutating
      if (index < best5PercentIndex) return;

      if (Utils.randomBool(mutationRateForRand)) {
        p.snakeBrain.mutate(this.geneMutationRate, this.mutationAmount);
      }
    });
  }
}
