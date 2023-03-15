import { SETTINGS } from "../Setting";
import GaModel from "../GaModel";

const totalTimes = SETTINGS.evolveTimes;

async function main() {
  const gaModel = new GaModel(SETTINGS.gaPlayerConfig);
  for (let i = 0; i < totalTimes; i++) {
    await gaModel.evolve(false);
  }
}

main();
