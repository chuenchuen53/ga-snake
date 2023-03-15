import type { DbCollections } from "../mongo";

export class SnakeService {
  public db: DbCollections;

  constructor(db: DbCollections) {
    this.db = db;
  }

  async getTimeIds() {
    const data = await this.db.timeId.find().toArray();
    return data;
  }

  async getGameRecord(timeId: number, generation: number) {
    const data = await this.db.gameRecord.findOne({ timeId: timeId, generation: generation });
    return data;
  }

  async getGenerationStats(timeId: number) {
    const data = await this.db.generationStats.find({ timeId: timeId }).toArray();
    return data;
  }

  async getLastGenerationStats(timeId: number) {
    const data = await this.db.generationStats
      .find({ timeId: timeId }, { sort: { generation: -1 } })
      .limit(1)
      .toArray();
    return data;
  }

  async getSnakeBrain(timeId: number, generation: number) {
    const data = await this.db.snakeBrain.findOne({ timeId: timeId, generation: generation });
    return data;
  }
}
