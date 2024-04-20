import type { GetAllTrainedModelsResponse, GetModelDetailResponse } from "snake-express/api-typing/trained-models";

const { REACT_APP_SERVER_HOST } = process.env;

const trainedModelsRoute = `${REACT_APP_SERVER_HOST}/api/trained-models`;

async function getAllTrainedModels(): Promise<GetAllTrainedModelsResponse> {
  const resp = await fetch(`${trainedModelsRoute}/all`, {
    method: "GET",
  });

  if (resp.status === 200) {
    return await resp.json();
  } else {
    console.error(resp.status, (await resp.json()).message);
    throw new Error("Failed to get all trained models");
  }
}

async function getModelDetail(id: string): Promise<GetModelDetailResponse> {
  const resp = await fetch(`${trainedModelsRoute}/detail/${id}`, {
    method: "GET",
  });

  if (resp.status === 200) {
    return await resp.json();
  } else {
    console.error(resp.status, (await resp.json()).message);
    throw new Error("Failed to get model detail");
  }
}

async function deleteModel(id: string): Promise<void> {
  const resp = await fetch(`${trainedModelsRoute}/model/${id}`, {
    method: "DELETE",
  });

  if (resp.status !== 204) {
    console.error(resp.status, (await resp.json()).message);
    throw new Error("Failed to delete model");
  }
}

const TrainedModelsApi = Object.freeze({
  getAllTrainedModels,
  getModelDetail,
  deleteModel,
});

export default TrainedModelsApi;
