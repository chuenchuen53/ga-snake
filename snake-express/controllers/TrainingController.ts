import { evolveRequestSchema, initModelRequestSchema, toggleBackupPopulationWhenFinishRequestSchema } from "../api-typing/zod/training";
import type TrainingService from "../services/TrainingService";
import type { Request, Response } from "express";
import type { GetCurrentModelInfoResponse, InitModelResponse } from "../api-typing/training";

export default class TrainingController {
  constructor(private service: TrainingService) {}

  public initModel = async (req: Request, res: Response) => {
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

  public evolve = (req: Request, res: Response) => {
    try {
      if (!this.haveModelGuard(res)) return;

      if (this.service.queueTraining) {
        res.status(400).json({ message: "training already started" });
        return;
      }

      const bodyValidation = evolveRequestSchema.safeParse(req.body);
      if (!bodyValidation.success) {
        res.status(400).json({ message: bodyValidation.error });
      } else {
        const { times } = bodyValidation.data;
        this.service.evolve(times);
        res.status(204).end();
      }
    } catch (err) {
      console.log("TrainingController ~ evolve= ~ err", err);
      res.status(500).json({ message: "internal server error" });
    }
  };

  public stopEvolve = (req: Request, res: Response) => {
    try {
      this.service.stopEvolve();
      res.status(204).end();
    } catch (err) {
      console.log("TrainingController ~ stopEvolve= ~ err", err);
      res.status(500).json({ message: "internal server error" });
    }
  };

  public toggleBackupPopulationWhenFinish = (req: Request, res: Response) => {
    try {
      const bodyValidation = toggleBackupPopulationWhenFinishRequestSchema.safeParse(req.body);
      if (!bodyValidation.success) {
        res.status(400).json({ message: bodyValidation.error });
        return;
      }
      const { backup } = bodyValidation.data;
      this.service.toggleBackupPopulationWhenFinish(backup);
      res.status(204).end();
    } catch (err) {
      console.log("TrainingController ~ toggleBackupPopulationWhenFinish= ~ err", err);
      res.status(500).json({ message: "internal server error" });
    }
  };

  public backupCurrentPopulation = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!this.haveModelGuard(res)) return;

      if (this.service.backupPopulationInProgress) {
        res.status(400).json({ message: "previous backup still in progress" });
        return;
      }

      const result = await this.service.backupCurrentPopulation();
      if (!result) {
        res.status(400).json({ message: "population already backup" });
      } else {
        res.status(204).end();
      }
    } catch (err) {
      const typedErr = err as { message: string };
      const { message } = typedErr;
      if (message === "model is evolving") {
        res.status(400).json({ message });
      } else {
        console.log("TrainingController ~ backupCurrentPopulation= ~ err", err);
        res.status(500).json({ message: "internal server error" });
      }
    }
  };

  public getCurrentModelInfo = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!this.haveModelGuard(res)) return;

      const modelInfo = await this.service.getCurrentModelInfo();
      res.json(modelInfo satisfies GetCurrentModelInfoResponse);
    } catch (err) {
      console.log("TrainingController ~ getCurrentModelInfo= ~ err", err);
      res.status(500).json({ message: "internal server error" });
    }
  };

  public removeCurrentModel = async (req: Request, res: Response) => {
    try {
      if (!this.haveModelGuard(res)) return;

      await this.service.removeCurrentModel();
      res.status(204).end();
    } catch (err) {
      console.log("TrainingController ~ removeCurrentModel= ~ err", err);
      res.status(500).json({ message: "internal server error" });
    }
  };

  private haveModelGuard = (res: Response) => {
    if (!this.service.gaModel) {
      res.status(400).json({ message: "model not exists" });
      return false;
    }
    return true;
  };
}
