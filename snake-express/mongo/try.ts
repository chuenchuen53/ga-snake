import { AppDb } from "./index";

async function main() {
  const db = AppDb.getInstance();
  await db.connect();

  const gaModel = await db.GaModel.findById("64134065faaeda7b88b19ee1").populate("evolveResultHistory").populate("populationHistory", "generation").exec();
  // console.log(JSON.stringify(gaModel, null, 2));
  console.log(gaModel);
}

main();
