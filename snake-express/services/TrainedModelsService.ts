import { AppDb } from "../mongo";
import type { PopulationHistory, EvolveResultWithId, GetAllTrainedModelsResponse, GetModelDetailResponse, TrainedModel } from "../api-typing/trained-models";

export default class TrainedModelsService {
  private db = AppDb.getInstance();

  public async getAllTrainedModels(): Promise<GetAllTrainedModelsResponse> {
    const getTrainedModelsDbResult: TrainedModel[] = (await this.db.GaModel.collection
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
          $lookup: {
            from: "populations",
            localField: "populationHistory",
            foreignField: "_id",
            pipeline: [{ $project: { generation: 1, _id: 0 } }],
            as: "populationHistory",
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
            populationHistory: 1,
          },
        },
      ])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .toArray()) as unknown as TrainedModel[];

    return { models: getTrainedModelsDbResult };
  }

  public async getModelDetail(id: string): Promise<GetModelDetailResponse> {
    const model = await this.db.GaModel.findById(id)
      .populate<{ evolveResultHistory: EvolveResultWithId[] }>("evolveResultHistory")
      .populate<{ populationHistory: PopulationHistory[] }>("populationHistory", "generation");
    if (!model) throw new Error("model does not exists");
    return model.toObject();
  }

  public async deleteModel(id: string): Promise<void> {
    try {
      const gaModel = await this.db.GaModel.findById(id);
      if (!gaModel) throw new Error(`No document found with id ${id}`);

      const populationHistoryIds = gaModel.populationHistory;
      const evolveResultHistoryIds = gaModel.evolveResultHistory;
      const populations = await this.db.Population.find({ _id: { $in: populationHistoryIds } });
      const individualIds = populations.map((population) => population.population).flat();

      await Promise.all([
        this.db.GaModel.findByIdAndDelete(id),
        this.db.EvolveResult.deleteMany({ _id: { $in: evolveResultHistoryIds } }),
        this.db.Population.deleteMany({ _id: { $in: populationHistoryIds } }),
        this.db.Individual.deleteMany({ _id: { $in: individualIds } }),
      ]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
