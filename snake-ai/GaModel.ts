import { utils } from "snake-game/utils";
import InputLayer from "./InputLayer";
import { CalcUtils } from "./CalcUtils";
import SnakeBrain from "./SnakeBrain";
import { generateLayerShape } from "./generateLayerShape";
import MultiThreadGames from "./MultiThreadGames";
import type { ActivationFunction } from "./CalcUtils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tempPrint: any = [];

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
    mutationRate: number;
    mutationAmount: number;
    trialTimes: number;
  };
}

interface IPopulation {
  snakeBrain: SnakeBrain;
  snakeLength: number;
  moves: number;
  fitness: number;
  survive: boolean;
  gameRecords: string;
}

type Population = IPopulation[];

export default class GaModel {
  public static fitness(moves: number, snakeLength: number, maxPossibleSnakeLength = 400): number {
    if (snakeLength === 0) return 0;

    const movesPerFood = moves / snakeLength;
    const ratioOfLength = snakeLength / maxPossibleSnakeLength;

    // for short snake
    const moveScore = moves * 10;
    const cyclicPenalty = moves * 6 * (1 - snakeLength / maxPossibleSnakeLength) ** 2;

    // for long snake, encourage fast eat food
    const lengthBaseScore = (snakeLength - 1) ** (2 + 6 * ratioOfLength) * maxPossibleSnakeLength;
    const lengthScore1 = lengthBaseScore * movesPerFood;

    // for long snake with survival more important
    const lengthScore2 = lengthBaseScore * moves * (1 - snakeLength / maxPossibleSnakeLength) ** 2;

    return moveScore - cyclicPenalty + lengthScore1 + lengthScore2;
  }

  public static spinRouletteWheel(options: IPopulation[]): IPopulation {
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
  public readonly mutationRate: number;
  public readonly mutationAmount: number;
  public readonly trialTimes: number;

  private _generation: number;
  private readonly _numberOfSurvival: number;

  private readonly population: Population;

  private readonly multiThreadGames: MultiThreadGames;

  constructor(option: Options) {
    this._generation = -1;

    this.worldHeight = option.worldHeight;
    this.worldWidth = option.worldWidth;
    this.hiddenLayersLength = option.snakeBrainConfig.hiddenLayersLength;
    this.hiddenLayerActivationFunction = option.snakeBrainConfig.hiddenLayerActivationFunction;
    this.populationSize = option.gaConfig.populationSize;
    this.surviveRate = option.gaConfig.surviveRate;
    this.mutationRate = option.gaConfig.mutationRate;
    this.mutationAmount = option.gaConfig.mutationAmount;
    this.trialTimes = option.gaConfig.trialTimes;
    this._numberOfSurvival = Math.floor(this.populationSize * this.surviveRate);

    if (this._numberOfSurvival < 2) throw Error("Survival less than 2, please increase survive rate or population size.");

    const inputLayerLength = InputLayer.inputLayerLength;
    const layerShapes = generateLayerShape(inputLayerLength, ...this.hiddenLayersLength, SnakeBrain.OUTPUT_LAYER_LENGTH);

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
        gameRecords: "",
      }));

    this.multiThreadGames = new MultiThreadGames();
  }

  public get generation() {
    return this._generation;
  }

  public get numberOfSurvival(): number {
    return this._numberOfSurvival;
  }

  public get basicConfig() {
    return {
      generation: this.generation,
      worldHeight: this.worldHeight,
      worldWidth: this.worldWidth,
      hiddenLayersLength: this.hiddenLayersLength,
      hiddenLayerActivationFunction: this.hiddenLayerActivationFunction,
      populationSize: this.populationSize,
      surviveRate: this.surviveRate,
      mutationRate: this.mutationRate,
      mutationAmount: this.mutationAmount,
      trialTimes: this.trialTimes,
      _numberOfSurvival: this._numberOfSurvival,
    };
  }

  public exportModal() {
    return JSON.stringify(this);
  }

  public async evolve(exportModal: boolean): Promise<{
    generation: number;
    population: Population;
    finalBestPlayer: IPopulation;
    bestSnakeBrain: SnakeBrain;
    bestGame: string;
    gaPlayer?: string;
  }> {
    const tempTime = new Date().getTime();

    await this.evaluate();
    this.select();
    this.crossover();
    this.mutate();

    const generation = this.generation;
    const finalBestPlayer = this.population[0];
    const bestSnakeBrain = finalBestPlayer.snakeBrain;
    const bestGame = finalBestPlayer.gameRecords;
    const population = this.population;

    const print = {
      generation,
      highestFitness: finalBestPlayer.fitness,
      meanFitness: population.reduce((acc, cur) => acc + cur.fitness, 0) / population.length,
      bestSnakeLength: finalBestPlayer.snakeLength,
      meanSnakeLength: population.reduce((acc, cur) => acc + cur.snakeLength, 0) / population.length,
      bestMoves: finalBestPlayer.moves,
      meanMoves: population.reduce((acc, cur) => acc + cur.moves, 0) / population.length,
      time: (new Date().getTime() - tempTime) / 1000,
    };

    tempPrint.push(print);
    console.table(tempPrint);

    if (exportModal) {
      return {
        generation,
        population,
        finalBestPlayer,
        bestSnakeBrain,
        bestGame,
        gaPlayer: this.exportModal(),
      };
    } else {
      return { generation, population, finalBestPlayer, bestSnakeBrain, bestGame };
    }
  }

  private async evaluate(): Promise<void> {
    this._generation++;

    const promise = this.population.map((p) => this.multiThreadGames.playGames(this.worldWidth, this.worldHeight, this.trialTimes, p.snakeBrain));
    const result = await Promise.all(promise);

    for (let i = 0; i < this.population.length; i++) {
      const p = this.population[i];
      const { snakeLengthArr, movesArr, gameRecordArr } = result[i];

      const fitnessArr: number[] = [];
      for (let j = 0; j < this.trialTimes; j++) {
        fitnessArr.push(GaModel.fitness(movesArr[j], snakeLengthArr[j]));
      }

      p.snakeLength = CalcUtils.stats.meanOfArray(snakeLengthArr);
      p.moves = CalcUtils.stats.meanOfArray(movesArr);
      p.fitness = CalcUtils.stats.meanOfArray(fitnessArr);
      p.gameRecords = gameRecordArr[CalcUtils.indexOfMaxValueInArray(fitnessArr)];
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

      const parent1 = this.pickParentIdx(childIdx);
      const parent2 = this.pickParentIdx(childIdx, parent1);
      p.snakeBrain.crossOver(parent1.snakeBrain, parent2.snakeBrain);
    });
  }

  private pickParentIdx(childIdx: number, anotherParent?: IPopulation): IPopulation {
    const anotherParentIdx = anotherParent ? this.population.findIndex((p) => p === anotherParent) : -1;
    const filteredPopulation = this.population.filter((p, idx) => idx !== childIdx && idx !== anotherParentIdx);
    return GaModel.spinRouletteWheel(filteredPopulation);
  }

  private mutate() {
    this.population.forEach((p, index) => {
      // prevent the best 5% from mutating
      if (index < this._numberOfSurvival * 0.05) return;

      // todo the first rate should be separate from the second rate for fine control
      if (utils.randomBool(this.mutationRate)) {
        p.snakeBrain.mutate(this.mutationRate, this.mutationAmount);
      }
    });
  }
}
