import express from "express";
import TrainedModelsService from "../services/TrainedModelsService";
import TrainedModelsController from "../controllers/TrainedModelsController";

const trainedModelsService = new TrainedModelsService();
const trainedModelsController = new TrainedModelsController(trainedModelsService);

export const trainedModelsRoutes = express.Router();
trainedModelsRoutes.get("/all", trainedModelsController.getAllTrainedModels);
trainedModelsRoutes.get("/detail/:id", trainedModelsController.getModelDetail);
trainedModelsRoutes.delete("/model/:id", trainedModelsController.deleteModel);
