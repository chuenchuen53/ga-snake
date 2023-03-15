import express from "express";
import { dbCollections } from "../mongo";
import { SnakeService } from "../services/SnakeService";
import { SnakeController } from "../controllers/SnakeController";

const snakeService = new SnakeService(dbCollections);
const snakeController = new SnakeController(snakeService);

export const snakeRoutes = express.Router();
snakeRoutes.get("/timeIds", snakeController.getTimeIds);
snakeRoutes.get("/gameRecord/:timeId/:generation", snakeController.getGameRecord);
snakeRoutes.get("/generationStats/:timeId", snakeController.getGenerationStats);
snakeRoutes.get("/lastGenerationStats/:timeId", snakeController.getLastGenerationStats);
snakeRoutes.get("/snakeBrain/:timeId/:generation", snakeController.getSnakeBrain);
