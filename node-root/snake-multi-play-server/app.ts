import express from "express";
// import cors from "cors";

// const corsOptions = {
//   origin: AppEnv.SNAKE_REACT_ORIGIN,
//   optionsSuccessStatus: 200,
// };

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(cors(corsOptions));

app.use((req, res, next) => {
  console.log(`[${new Date()}] Method: ${req.method}, Request: ${req.path}`);
  next();
});

app.post("/api/result", (req, res) => {
  console.log(req.body);
  res.json({ data: Math.random().toFixed(3), message: "ok" });
});

const PORT = 8081;
app.listen(PORT, () => {
  console.log(`[INFO] listening to port ${PORT}`);
});
