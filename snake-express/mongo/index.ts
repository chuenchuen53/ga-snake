import mongoose from "mongoose";
import AppEnv from "../AppEnv";
import { GaModel } from "./GaModel";
import { EvolveResult } from "./EvolveResult";
import { Population } from "./Population";

export class AppDb {
  private static instance: AppDb;

  public static getInstance(): AppDb {
    if (!AppDb.instance) AppDb.instance = new AppDb();
    return AppDb.instance;
  }

  public readonly GaModel = GaModel;
  public readonly Population = Population;
  public readonly EvolveResult = EvolveResult;

  private constructor() {}

  public async connect(): Promise<void> {
    console.log("[INFO] database start connecting...");
    await mongoose.connect(AppEnv.MONGODB_CONN_STRING, {
      dbName: AppEnv.DATABASE_NAME,
      bufferCommands: false,
    });
    console.log("[INFO] database connected");
  }
}
