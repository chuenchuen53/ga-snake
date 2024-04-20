import { evolveRequestSchema, initModelRequestSchema, pollingInfoRequestSchema, resumeModelRequestSchema, toggleBackupPopulationWhenFinishRequestSchema } from "../api-typing/zod/training";
import type TrainingService from "../services/TrainingService";
import type { Request, Response } from "express";
import type { InitModelResponse, PollingInfoResponse } from "../api-typing/training";

export default class TrainingController {
  private static pollingTimeOut = 30000;

  constructor(private service: TrainingService) {}

  public initModel = async (req: Request, res: Response) => {
    try {
      if (this.service.currentModelId) {
        res.status(400).json({ message: "model already exists" });
        return;
      }

      const bodyValidation = initModelRequestSchema.safeParse(req.body);
      if (!bodyValidation.success) {
        res.status(400).json({ message: bodyValidation.error });
      } else {
        const { options } = bodyValidation.data;
        await this.service.initModel(options);
        const currentModelInfo = await this.service.getCurrentModelInfo();
        res.json({ modelInfo: currentModelInfo } satisfies InitModelResponse);
      }
    } catch (err) {
      console.log("TrainingController ~ initModel= ~ err", err);
      res.status(500).json({ message: "internal server error" });
    }
  };

  public resumeModel = async (req: Request, res: Response) => {
    try {
      if (this.service.currentModelId) {
        res.status(400).json({ message: "model already exists" });
        return;
      }

      const bodyValidation = resumeModelRequestSchema.safeParse(req.body);
      if (!bodyValidation.success) {
        res.status(400).json({ message: bodyValidation.error });
      } else {
        const { modelId, generation } = bodyValidation.data;
        await this.service.resumeModel(modelId, generation);
        const currentModelInfo = await this.service.getCurrentModelInfo();
        res.json({ modelInfo: currentModelInfo } satisfies InitModelResponse);
      }
    } catch (err) {
      const typedErr = err as { message: string };
      const { message } = typedErr;
      if (message === "model not found" || message === "population not found") {
        res.status(400).json({ message });
      } else {
        console.log("TrainingController ~ resumeModel= ~ err", err);
        res.status(500).json({ message: "internal server error" });
      }
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
      if (!this.service.currentModelId) {
        res.json({ modelInfo: null } satisfies InitModelResponse);
      } else {
        const currentModelInfo = await this.service.getCurrentModelInfo();
        res.json({ modelInfo: currentModelInfo } satisfies InitModelResponse);
      }
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

  public pollingInfo = async (req: Request, res: Response) => {
    try {
      if (!this.haveModelGuard(res)) return;

      const bodyValidation = pollingInfoRequestSchema.safeParse({
        currentEvolvingResultHistoryGeneration: parseInt(req.params.currentEvolvingResultHistoryGeneration),
        currentPopulationHistoryGeneration: parseInt(req.params.currentPopulationHistoryGeneration),
        currentBackupPopulationInProgress: stringToBoolean(req.params.currentBackupPopulationInProgress),
        currentBackupPopulationWhenFinish: stringToBoolean(req.params.currentBackupPopulationWhenFinish),
        currentEvolving: stringToBoolean(req.params.currentEvolving),
      });

      if (!bodyValidation.success) {
        res.status(400).json({ message: bodyValidation.error });
        return;
      }

      const { currentEvolvingResultHistoryGeneration, currentPopulationHistoryGeneration, currentBackupPopulationInProgress, currentBackupPopulationWhenFinish, currentEvolving } = bodyValidation.data;

      const stateMatch = this.service.stateMatch({
        evolvingResultHistoryGeneration: currentEvolvingResultHistoryGeneration,
        populationHistoryGeneration: currentPopulationHistoryGeneration,
        backupPopulationInProgress: currentBackupPopulationInProgress,
        backupPopulationWhenFinish: currentBackupPopulationWhenFinish,
        evolving: currentEvolving,
      });

      if (!stateMatch) {
        const info = this.service.pollingInfo({
          currentEvolvingResultHistoryGeneration,
          currentPopulationHistoryGeneration,
        });
        res.json(info satisfies PollingInfoResponse);
        return;
      }

      const info: PollingInfoResponse = await new Promise<PollingInfoResponse>((resolve) => {
        const handler = () => {
          const info = this.service.pollingInfo({
            currentEvolvingResultHistoryGeneration,
            currentPopulationHistoryGeneration,
          });
          resolve(info);
        };

        setTimeout(() => {
          const info: PollingInfoResponse = {
            newEvolveResultHistory: [],
            newPopulationHistory: [],
            backupPopulationInProgress: currentBackupPopulationInProgress,
            backupPopulationWhenFinish: currentBackupPopulationWhenFinish,
            evolving: currentEvolving,
          };
          resolve(info);
        }, TrainingController.pollingTimeOut);

        this.service.emitter.once("change", handler);
      });

      res.json(info satisfies PollingInfoResponse);
    } catch (err) {
      console.log("TrainingController ~ pollingInfo= ~ err", err);
      res.status(500).json({ message: "internal server error" });
    }
  };

  private haveModelGuard = (res: Response) => {
    if (!this.service.currentModelId) {
      res.status(400).json({ message: "model does not exists" });
      return false;
    }
    return true;
  };
}

function stringToBoolean(str: string): boolean | string {
  return str === "true" ? true : str === "false" ? false : str;
}
