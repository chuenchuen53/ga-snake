import type { EvolveRequest, GetCurrentModelInfoResponse, InitModelRequest, InitModelResponse, PollingInfoResponse, toggleBackupPopulationWhenFinishRequest } from "snake-express/api-typing/training";

const { REACT_APP_SERVER_HOST } = process.env;

const trainingRoute = `${REACT_APP_SERVER_HOST}/api/training`;

async function initModel(body: InitModelRequest): Promise<InitModelResponse> {
  const resp = await fetch(`${trainingRoute}/init-model`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (resp.status === 200) {
    return await resp.json();
  } else {
    console.error(resp.status, (await resp.json()).message);
    throw new Error("Failed to init model");
  }
}

async function evolve(body: EvolveRequest): Promise<void> {
  const resp = await fetch(`${trainingRoute}/evolve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (resp.status !== 204) {
    console.error(resp.status, (await resp.json()).message);
    throw new Error("Failed to evolve");
  }
}

async function stopEvolve(): Promise<void> {
  const resp = await fetch(`${trainingRoute}/stop-evolve`, {
    method: "POST",
  });

  if (resp.status !== 204) {
    console.error(resp.status, (await resp.json()).message);
    throw new Error("Failed to stop evolve");
  }
}

async function backupCurrentPopulation(): Promise<void> {
  const resp = await fetch(`${trainingRoute}/backup-current-population`, {
    method: "POST",
  });

  if (resp.status !== 204) {
    console.error(resp.status, (await resp.json()).message);
    throw new Error("Failed to backup current population");
  }
}

async function toggleBackupPopulationWhenFinish(body: toggleBackupPopulationWhenFinishRequest): Promise<void> {
  const resp = await fetch(`${trainingRoute}/toggle-backup-population-when-finish`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (resp.status !== 204) {
    console.error(resp.status, (await resp.json()).message);
    throw new Error("Failed to toggle backup population when finish");
  }
}

async function getCurrentModelInfo(): Promise<GetCurrentModelInfoResponse> {
  const resp = await fetch(`${trainingRoute}/current-model-info`, {
    method: "GET",
  });

  if (resp.status === 200) {
    return await resp.json();
  } else {
    console.error(resp.status, (await resp.json()).message);
    throw new Error("Failed to get current model info");
  }
}

async function removeCurrentModel(): Promise<void> {
  const resp = await fetch(`${trainingRoute}/current-model`, {
    method: "DELETE",
  });

  if (resp.status !== 204) {
    console.error(resp.status, (await resp.json()).message);
    throw new Error("Failed to remove current model");
  }
}

async function pollingInfo(
  currentEvolvingResultHistoryGeneration: number,
  currentPopulationHistoryGeneration: number,
  currentBackupPopulationInProgress: boolean,
  currentBackupPopulationWhenFinish: boolean,
  currentEvolving: boolean
): Promise<PollingInfoResponse> {
  const resp = await fetch(
    `${trainingRoute}/polling-info/${currentEvolvingResultHistoryGeneration}/${currentPopulationHistoryGeneration}/${currentBackupPopulationInProgress}/${currentBackupPopulationWhenFinish}/${currentEvolving}`,
    {
      method: "GET",
    }
  );

  if (resp.status === 200) {
    return await resp.json();
  } else {
    console.error(resp.status, (await resp.json()).message);
    throw new Error("Failed to get polling info");
  }
}

const TrainingApi = {
  initModel,
  evolve,
  stopEvolve,
  backupCurrentPopulation,
  toggleBackupPopulationWhenFinish,
  getCurrentModelInfo,
  removeCurrentModel,
  pollingInfo,
};

export default TrainingApi;
