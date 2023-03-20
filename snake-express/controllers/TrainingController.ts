import events from "events";
import { evolveRequestSchema, initModelRequestSchema, toggleBackupPopulationWhenFinishRequestSchema } from "../api-typing/zod/training";
import type TrainingService from "../services/TrainingService";
import type { Request, Response } from "express";
import type { GetCurrentModelInfoResponse, InitModelResponse, PollingInfoResponse } from "../api-typing/training";

export default class TrainingController {
  private static pollingTimeOut = 30000;

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
        const currentModelInfo = await this.service.initModel(options);
        res.json(currentModelInfo satisfies InitModelResponse);
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

  public pollingInfo = async (req: Request, res: Response) => {
    try {
      if (!this.haveModelGuard(res)) return;

      const currentEvolvingResultHistoryGeneration = parseInt(req.params.currentEvolvingResultHistoryGeneration);
      const currentPopulationHistoryGeneration = parseInt(req.params.currentPopulationHistoryGeneration);
      const currentBackupPopulationInProgress = req.params.currentBackupPopulationInProgress.toString() === "true";
      const currentBackupPopulationWhenFinish = req.params.currentBackupPopulationWhenFinish.toString() === "true";
      const currentEvolving = req.params.currentEvolving.toString() === "true";

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
        const emitter = new events.EventEmitter();
        emitter.once("change", () => {
          const info = this.service.pollingInfo({
            currentEvolvingResultHistoryGeneration,
            currentPopulationHistoryGeneration,
          });
          this.service.removeEmitter(emitter);
          resolve(info);
        });
        this.service.addEmitter(emitter);

        setTimeout(() => {
          emitter.removeListener("change", () => {
            // do nothing
          });
          const info: PollingInfoResponse = {
            newEvolveResultHistory: [],
            newPopulationHistory: [],
            backupPopulationInProgress: currentBackupPopulationInProgress,
            backupPopulationWhenFinish: currentBackupPopulationWhenFinish,
            evolving: currentEvolving,
          };
          this.service.removeEmitter(emitter);
          resolve(info);
        }, TrainingController.pollingTimeOut);
      });

      res.json(info satisfies PollingInfoResponse);
    } catch (err) {
      console.log("TrainingController ~ pollingInfo= ~ err", err);
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
