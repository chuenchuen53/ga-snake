import express from "express";
import { trainingRoutes } from "../routers/trainingRoutes";

export const routes = express.Router();
routes.use("/training", trainingRoutes);
