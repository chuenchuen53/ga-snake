import express from "express";
import TrainingService from "../services/TrainingService";
import TrainingController from "../controllers/TrainingController";

const trainingService = new TrainingService();
const trainingController = new TrainingController(trainingService);

export const trainingRoutes = express.Router();
trainingRoutes.post("/init-model", trainingController.initModel);
trainingRoutes.post("/evolve", trainingController.evolve);
trainingRoutes.post("/stop-evolve", trainingController.stopEvolve);
trainingRoutes.post("/backup-current-population", trainingController.backupCurrentPopulation);
trainingRoutes.put("/toggle-backup-population-when-finish", trainingController.toggleBackupPopulationWhenFinish);
trainingRoutes.get("/current-model-info", trainingController.getCurrentModelInfo);
trainingRoutes.delete("/current-model", trainingController.removeCurrentModel);
