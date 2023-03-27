import { parentPort } from "worker_threads";
import GaModel from "snake-ai/GaModel";
import { WorkerAction } from "./typing";
import type { WorkerMessage, WorkerResponse } from "./typing";

let gaModel: GaModel | null = null;
let working: WorkerAction | null = null;

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const typedParentPort = parentPort!;

typedParentPort.on("message", async (message: WorkerMessage) => {
  if (!workingGuard(message.action)) return;

  switch (message.action) {
    case WorkerAction.NEW_MODEL: {
      if (gaModel) {
        const response: WorkerResponse = {
          action: WorkerAction.NEW_MODEL,
          errMessage: "model already exists",
        };
        typedParentPort.postMessage(response);
        return;
      }

      await doWork(message.action, async () => {
        const { options, numOfThreads } = message.payload;
        gaModel = new GaModel(options, numOfThreads);
        const response: WorkerResponse = {
          action: WorkerAction.NEW_MODEL,
          response: { gaModel: gaModel.exportModel() },
        };
        typedParentPort.postMessage(response);
      });
      break;
    }
    case WorkerAction.EVOLVE: {
      if (!guardModelExists(message.action, gaModel)) return;

      await doWork(message.action, async () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- guardModelExists checked
        const evolveResult = await gaModel!.evolve();
        const response: WorkerResponse = {
          action: WorkerAction.EVOLVE,
          response: { evolveResult },
        };
        typedParentPort.postMessage(response);
      });
      break;
    }
    case WorkerAction.GET_POPULATION: {
      if (!guardModelExists(message.action, gaModel)) return;

      await doWork(message.action, () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- guardModelExists checked
        const gaModelData = gaModel!.exportModel();
        const response: WorkerResponse = {
          action: WorkerAction.GET_POPULATION,
          response: {
            generation: gaModelData.generation,
            population: gaModelData.population,
          },
        };
        typedParentPort.postMessage(response);
      });
      break;
    }
    case WorkerAction.REMOVE_MODEL: {
      await doWork(message.action, async () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- guardModelExists checked
        await gaModel!.destroy();
        gaModel = null;
        typedParentPort.postMessage({ action: WorkerAction.REMOVE_MODEL });
      });
    }
  }
});

function guardModelExists(action: WorkerAction, gaModel: GaModel | null): boolean {
  if (!gaModel) {
    typedParentPort.postMessage({
      action,
      errMessage: "gaModel not exists",
    } satisfies WorkerResponse);
    return false;
  }
  return true;
}

function workingGuard(action: WorkerAction): boolean {
  if (working) {
    typedParentPort.postMessage({
      action,
      errMessage: `working in progress: ${working}`,
    });
    return false;
  }

  return true;
}

async function doWork(action: WorkerAction, fn: () => void): Promise<void> {
  working = action;
  await fn();
  working = null;
}
