import { AppDb } from "./index";

async function main() {
  const db = AppDb.getInstance();
  await db.connect();
}

main();
