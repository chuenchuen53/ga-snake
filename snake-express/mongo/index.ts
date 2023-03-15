import dotenv from "dotenv";
import * as mongoDB from "mongodb";

dotenv.config();
if (!process.env.MONGODB_NAME || !process.env.MONGODB_CONN_STRING) {
  throw Error("MONGODB_NAME and MONGODB_CONN_STRING are required");
}

export interface DbCollections {
  timeId: mongoDB.Collection;
  snakeBrain: mongoDB.Collection;
  gameRecord: mongoDB.Collection;
  generationStats: mongoDB.Collection;
  population: mongoDB.Collection;
}

console.log("[INFO]: mongoClient start connecting...");
export const mongoClient = new mongoDB.MongoClient(process.env.MONGODB_CONN_STRING);
export const dbCollections: DbCollections = {} as DbCollections;
mongoClient.connect().then(async () => {
  console.log("[INFO]: mongoClient.connected");
  const db = mongoClient.db(process.env.MONGODB_NAME);

  dbCollections["timeId"] = db.collection("timeId");
  dbCollections["snakeBrain"] = db.collection("snakeBrain");
  dbCollections["gameRecord"] = db.collection("gameRecord");
  dbCollections["generationStats"] = db.collection("generationStats");
  dbCollections["population"] = db.collection("population");
});
