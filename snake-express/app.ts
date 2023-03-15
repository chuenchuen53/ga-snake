import dotenv from "dotenv";

import express from "express";
import cors from "cors";
import { routes } from "./routes";

dotenv.config();

if (!process.env.SNAKE_REACT_ORIGIN) throw new Error("SNAKE_REACT_ORIGIN is not defined in env");

const corsOptions = {
  origin: process.env.SNAKE_REACT_ORIGIN,
  optionsSuccessStatus: 200,
};

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));

const API_VERSION = "/api";
app.use(API_VERSION, routes);

app.use("/hi", (req, res) => {
  res.send("Hello World!");
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`[INFO] listening to port ${PORT}`);
});
