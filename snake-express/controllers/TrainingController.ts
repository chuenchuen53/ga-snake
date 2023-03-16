import type { Request, Response } from "express";
import type { TrainingService } from "../services/TrainingService";

export default class TrainingController {
  constructor(private service: TrainingService) {}

  getTimeIds = async (req: Request, res: Response) => {
    try {
      const data = await this.service.getTimeIds();
      res.status(200).json({ data });
    } catch (err) {
      console.log("SnakeController ~ getTimeIds= ~ err", err);
      res.status(500).json({ message: "internal server error" });
    }
  };

  getGameRecord = async (req: Request, res: Response) => {
    try {
      const timeId = parseInt(req.params.timeId);
      console.log("SnakeController ~ getGameRecord= ~ timeId", timeId);
      const generation = parseInt(req.params.generation);
      console.log("SnakeController ~ getGameRecord= ~ generation", generation);
      const data = await this.service.getGameRecord(timeId, generation);
      res.status(200).json({ data });
    } catch (err) {
      console.log("SnakeController ~ getGameRecord= ~ err", err);
      res.status(500).json({ message: "internal server error" });
    }
  };

  getGenerationStats = async (req: Request, res: Response) => {
    try {
      const timeId = parseInt(req.params.timeId);
      const data = await this.service.getGenerationStats(timeId);
      res.status(200).json({ data });
    } catch (err) {
      console.log("SnakeController ~ getGenerationStats= ~ err", err);
      res.status(500).json({ message: "internal server error" });
    }
  };

  getLastGenerationStats = async (req: Request, res: Response) => {
    try {
      const timeId = parseInt(req.params.timeId);
      const data = await this.service.getLastGenerationStats(timeId);
      res.status(200).json({ data });
    } catch (err) {
      console.log("SnakeController ~ getLastGenerationStats= ~ err", err);
      res.status(500).json({ message: "internal server error" });
    }
  };

  getSnakeBrain = async (req: Request, res: Response) => {
    try {
      const timeId = parseInt(req.params.timeId);
      const generation = parseInt(req.params.generation);
      const data = await this.service.getSnakeBrain(timeId, generation);
      res.status(200).json({ data });
    } catch (err) {
      console.log("SnakeController ~ getSnakeBrain= ~ err", err);
      res.status(500).json({ message: "internal server error" });
    }
  };
}
