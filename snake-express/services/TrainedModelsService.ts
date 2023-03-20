import { AppDb } from "../mongo";
import type { EvolveResult } from "snake-ai/GaModel";
import type { GetCurrentModelInfoResponse } from "../api-typing/training";
import type { GetAllTrainedModelsResponse } from "../api-typing/trained-models";

export default class TrainedModelsService {
  private db = AppDb.getInstance();

  public async getAllTrainedModels(): Promise<GetAllTrainedModelsResponse> {
    const getTrainedModelsDbResult: any[] = (await this.db.GaModel.collection
      .aggregate([
        { $addFields: { lastEvolveResultId: { $last: "$evolveResultHistory" } } },
        {
          $lookup: {
            from: "evolveresults",
            localField: "lastEvolveResultId",
            foreignField: "_id",
            pipeline: [
              {
                $project: {
                  "bestIndividual.snakeLength": 1,
                  "bestIndividual.moves": 1,
                  "overallStats.snakeLength.mean": 1,
                  "overallStats.moves.mean": 1,
                },
              },
            ],
            as: "itemDetail",
          },
        },
        {
          $project: {
            id: 1,
            createdAt: 1,
            generation: 1,
            lastId: "$lastEvolveResultId",
            bestSnakeLength: { $ifNull: [{ $arrayElemAt: ["$itemDetail.bestIndividual.snakeLength", 0] }, null] },
            bestMoves: { $ifNull: [{ $arrayElemAt: ["$itemDetail.bestIndividual.moves", 0] }, null] },
            snakeLengthMean: { $ifNull: [{ $arrayElemAt: ["$itemDetail.overallStats.snakeLength.mean", 0] }, null] },
            movesMean: { $ifNull: [{ $arrayElemAt: ["$itemDetail.overallStats.moves.mean", 0] }, null] },
          },
        },
      ])
      .toArray()) as any;

    const models = getTrainedModelsDbResult.map((model) => {
      const { _id, ...rest } = model;
      return {
        id: _id.toString(),
        createdAt: _id.getTimestamp(),
        ...rest,
      };
    });

    return { models };
  }

  public async getModelDetail(id: string): Promise<GetCurrentModelInfoResponse> {
    const model = await this.db.GaModel.findById(id)
      .populate<{ evolveResultHistory: EvolveResult[] }>("evolveResultHistory")
      .populate<{ populationHistory: { generation: number }[] }>("populationHistory", "generation")
      .exec();
    if (!model) throw new Error("model not exists");
    return model.toObject();
  }

  public async deleteModel(id: string): Promise<void> {
    const model = await this.db.GaModel.findById(id).exec();
    console.log(model, "todo");
    return;
  }
}
