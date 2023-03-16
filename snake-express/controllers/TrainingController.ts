import { evolveRequestSchema, initModelRequestSchema, toggleBackupPopulationRequestSchema } from "../api-typing/zod/training";
import type TrainingService from "../services/TrainingService";
import type { Request, Response } from "express";
import type { GetCurrentModelInfoResponse, InitModelResponse } from "../api-typing/training";

export default class TrainingController {
  constructor(private service: TrainingService) {}

  public initModel = async (req: Request, res: Response): Promise<void> => {
    try {
      if (this.service.gaModel) {
        res.status(400).json({ message: "model already exists" });
        return;
      }

      const bodyValidation = initModelRequestSchema.safeParse(req.body);
      if (!bodyValidation.success) {
        res.status(400).json({ message: bodyValidation.error });
      } else {
        const { options } = bodyValidation.data;
        const id = await this.service.initModel(options);
        res.json({ id } satisfies InitModelResponse);
      }
    } catch (err) {
      console.log("TrainingController ~ initModel= ~ err", err);
      res.status(500).json({ message: "internal server error" });
    }
  };

  public evolve = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!this.service.gaModel) {
        res.status(400).json({ message: "model not exists" });
        return;
      } else if (this.service.queueTrainingTime) {
        res.status(400).json({ message: "training already started" });
        return;
      }

      const bodyValidation = evolveRequestSchema.safeParse(req.body);
      if (!bodyValidation.success) {
        res.status(400).json({ message: "bad request" });
      } else {
        const { times } = bodyValidation.data;
        await this.service.evolve(times);
        res.status(204).end();
      }
    } catch (err) {
      console.log("TrainingController ~ evolve= ~ err", err);
      res.status(500).json({ message: "internal server error" });
    }
  };

  public stopEvolve = (req: Request, res: Response): void => {
    try {
      this.service.stopEvolve();
      res.status(204).end();
    } catch (err) {
      console.log("TrainingController ~ stopEvolve= ~ err", err);
      res.status(500).json({ message: "internal server error" });
    }
  };

  public togglePopulationModel = (req: Request, res: Response): void => {
    try {
      const bodyValidation = toggleBackupPopulationRequestSchema.safeParse(req.body);
      if (!bodyValidation.success) {
        res.status(400).json({ message: "bad request" });
      } else {
        const { backup } = bodyValidation.data;
        this.service.toggleBackupPopulation(backup);
        res.status(204).end();
      }
    } catch (err) {
      console.log("TrainingController ~ toggleBackupModel= ~ err", err);
      res.status(500).json({ message: "internal server error" });
    }
  };

  public getCurrentModelInfo = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!this.service.gaModel) {
        res.status(400).json({ message: "model not exists" });
        return;
      }

      const modelInfo = await this.service.getCurrentModelInfo();
      res.json(modelInfo satisfies GetCurrentModelInfoResponse);
    } catch (err) {
      console.log("TrainingController ~ getCurrentModelInfo= ~ err", err);
      res.status(500).json({ message: "internal server error" });
    }
  };
}
