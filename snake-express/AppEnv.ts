import dotenv from "dotenv";

dotenv.config();

if (!process.env.SNAKE_REACT_ORIGIN) throw new Error("SNAKE_REACT_ORIGIN is not set");
if (!process.env.MONGODB_CONN_STRING) throw new Error("MONGODB_CONN_STRING is not set");
if (!process.env.DATABASE_NAME) throw new Error("DATABASE_NAME is not set");
if (!process.env.NUM_OF_THREADS) throw new Error("NUM_OF_THREADS is not set");

if (isNaN(parseInt(process.env.NUM_OF_THREADS)) || parseInt(process.env.NUM_OF_THREADS) < 1) throw new Error("NUM_OF_THREADS is not a number");

const AppEnv = Object.freeze({
  SNAKE_REACT_ORIGIN: process.env.SNAKE_REACT_ORIGIN,
  MONGODB_CONN_STRING: process.env.MONGODB_CONN_STRING,
  DATABASE_NAME: process.env.DATABASE_NAME,
  NUM_OF_THREADS: parseInt(process.env.NUM_OF_THREADS),
}) satisfies Record<string, string | number>;

export default AppEnv;
