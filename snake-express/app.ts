import express from "express";
import cors from "cors";
import { routes } from "./routes";
import AppEnv from "./AppEnv";
import { AppDb } from "./mongo";

const corsOptions = {
  origin: AppEnv.SNAKE_REACT_ORIGIN,
  optionsSuccessStatus: 200,
};

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));

app.use((req, res, next) => {
  console.log(`[${new Date()}] Request: ${req.path}`);
  next();
});

app.use("/hi", (req, res) => {
  res.send("Hello World!");
});

const API_VERSION = "/api";
app.use(API_VERSION, routes);

// todo
const db = AppDb.getInstance();
db.connect().then(() => {
  const PORT = 8080;
  app.listen(PORT, () => {
    console.log(`[INFO] listening to port ${PORT}`);
  });
});
