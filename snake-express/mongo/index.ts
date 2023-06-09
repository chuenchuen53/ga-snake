import mongoose from "mongoose";
import AppEnv from "../AppEnv";
import { GaModel } from "./GaModel";
import { EvolveResult } from "./EvolveResult";
import { Population } from "./Population";
import { Individual } from "./Individual";

export class AppDb {
  private static instance: AppDb;

  public static getInstance(): AppDb {
    if (!AppDb.instance) AppDb.instance = new AppDb();
    return AppDb.instance;
  }

  public readonly GaModel = GaModel;
  public readonly Population = Population;
  public readonly EvolveResult = EvolveResult;
  public readonly Individual = Individual;

  private constructor() {}

  public async connect(): Promise<void> {
    console.log(`[INFO] ${new Date()} database start connecting...`);
    await mongoose.connect(AppEnv.MONGODB_CONN_STRING, {
      dbName: AppEnv.DATABASE_NAME,
      bufferCommands: false,
    });
    console.log(`[INFO] ${new Date()} database connected`);
  }

  public async close(): Promise<void> {
    await mongoose.connection.close();
  }
}
