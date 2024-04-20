import express from "express";
import { trainingRoutes } from "../routers/trainingRoutes";
import { trainedModelsRoutes } from "../routers/trainedModelsRoutes";

export const routes = express.Router();
routes.use("/training", trainingRoutes);
routes.use("/trained-models", trainedModelsRoutes);
