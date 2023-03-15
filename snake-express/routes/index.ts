import express from "express";
import { snakeRoutes } from "../routers/snakeRoutes";

export const routes = express.Router();
routes.use("/snake", snakeRoutes);
