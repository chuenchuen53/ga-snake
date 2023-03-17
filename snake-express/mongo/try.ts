import { AppDb } from "./index";

async function main() {
  const db = AppDb.getInstance();
  await db.connect();

  const result = await db.GaModel.findById("6414772270c0e6628fec57c1").select("populationHistory").populate<{ populationHistory: { generation: number } }>("populationHistory", "generation");
  console.log(result);

  await db.close();
}

main();
