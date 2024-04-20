import TrainingService from "../services/TrainingService";
import type { GetAllTrainedModelsResponse, GetModelDetailResponse } from "../api-typing/trained-models";
import type TrainedModelsService from "../services/TrainedModelsService";
import type { Request, Response } from "express";

export default class TrainedModelsController {
  constructor(private service: TrainedModelsService) {}

  public getAllTrainedModels = async (req: Request, res: Response) => {
    try {
      const data = await this.service.getAllTrainedModels();
      res.json(data satisfies GetAllTrainedModelsResponse);
    } catch (err) {
      console.log("TrainedModelsController ~ getAllTrainedModels= ~ err", err);
      res.status(500).json({ message: "internal server error" });
    }
  };

  public getModelDetail = async (req: Request, res: Response) => {
    try {
      const data = await this.service.getModelDetail(req.params.id);
      res.json(data satisfies GetModelDetailResponse);
    } catch (err) {
      console.log("TrainedModelsController ~ getModelDetail= ~ err", err);
      res.status(500).json({ message: "internal server error" });
    }
  };

  public deleteModel = async (req: Request, res: Response) => {
    try {
      if (req.params.id === TrainingService.currentModelId) {
        res.status(400).json({ message: "cannot delete the current model" });
        return;
      }

      await this.service.deleteModel(req.params.id);
      res.status(204).end();
    } catch (err) {
      console.log("TrainedModelsController ~ deleteModel= ~ err", err);
      res.status(500).json({ message: "internal server error" });
    }
  };
}
