import type { IndividualPlainObject, IGaModel, Options, EvolveResult } from "snake-ai/GaModel";

export enum WorkerAction {
  NEW_MODEL = "NEW_MODEL",
  EVOLVE = "EVOLVE",
  GET_POPULATION = "GET_POPULATION",
  REMOVE_MODEL = "REMOVE_MODEL",
}

export interface NewModelMessage {
  action: WorkerAction.NEW_MODEL;
  payload: {
    options: Options;
    numOfThreads: number;
  };
}

export interface EvolveMessage {
  action: WorkerAction.EVOLVE;
}

export interface GetPopulationMessage {
  action: WorkerAction.GET_POPULATION;
}

export interface RemoveModelMessage {
  action: WorkerAction.REMOVE_MODEL;
}

export type WorkerMessage = NewModelMessage | EvolveMessage | GetPopulationMessage | RemoveModelMessage;

export interface FailResponse {
  action: WorkerAction;
  errMessage: string;
}

export interface NewModelResponse {
  action: WorkerAction.NEW_MODEL;
  response: {
    gaModel: IGaModel;
  };
}

export interface EvolveResponse {
  action: WorkerAction.EVOLVE;
  response: {
    evolveResult: EvolveResult;
  };
}

export interface GetPopulationResponse {
  action: WorkerAction.GET_POPULATION;
  response: {
    generation: number;
    population: IndividualPlainObject[];
  };
}

export interface RemoveModelResponse {
  action: WorkerAction.REMOVE_MODEL;
}

export type WorkerResponse = FailResponse | NewModelResponse | EvolveResponse | GetPopulationResponse | RemoveModelResponse;
