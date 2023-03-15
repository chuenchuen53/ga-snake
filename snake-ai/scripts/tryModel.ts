import { SETTINGS } from "../Setting";
import GaModel from "../GaModel";

const times = 10;
const totalTimes = SETTINGS.evolveTimes;

function main() {
  const gaModel = new GaModel(SETTINGS.gaPlayerConfig);
  for (let i = 0; i < totalTimes / times; i++) {
    gaModel.evolveMultipleTimes(times, false);
  }
}

main();
