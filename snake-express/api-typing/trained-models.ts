export interface TrainedModel {
  id: string;
  createdAt: Date;
  generation: number;
  bestSnakeLength: number | null;
  bestMoves: number | null;
  snakeLengthMean: number | null;
  movesMean: number | null;
}

export interface GetAllTrainedModelsResponse {
  models: TrainedModel[];
}
