import GaModel from "../GaModel";
import { setting } from "./setting";

async function main() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const print: any[] = [];

  const gaModel = new GaModel(setting.gaPlayerConfig, 10);
  for (let i = 0; i < setting.evolveTimes; i++) {
    const result = await gaModel.evolve();
    print.push({
      generation: i,
      bestFitness: result.bestIndividual.fitness,
      bestLength: result.bestIndividual.snakeLength,
      meanFitness: result.overallStats.fitness.mean,
      meanLength: result.overallStats.snakeLength.mean,
      timeSpent: result.timeSpent,
    });
    console.table(print.slice(-50));
  }
}

main();
