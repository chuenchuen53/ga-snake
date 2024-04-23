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
  console.log(`[${new Date()}] Method: ${req.method}, Request: ${req.path}`);
  next();
});

const API_VERSION = "/api";
app.use(API_VERSION, routes);

app.get("/testing", async (req, res) => {
  try {
    const resp = await fetch("http://localhost:8081/api/result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: "hello" }),
    });

    if (resp.status === 200) {
      const data = await resp.json();
      res.json(data);
    } else {
      res.status(500);
    }
  } catch (e) {
    console.log(e);
    res.status(500);
  }
});

const db = AppDb.getInstance();
db.connect().then(() => {
  const PORT = 8080;
  app.listen(PORT, () => {
    console.log(`[INFO] listening to port ${PORT}`);
  });
});
