import { z } from "zod";
import { ActivationFunction } from "snake-ai/CalcUtils";
import type { Options } from "snake-ai/GaModel";
import type { ISnakeBrain } from "snake-ai/SnakeBrain";

export const activationFunctionSchema = z.nativeEnum(ActivationFunction);

export const layerShapeSchema = z.tuple([z.number(), z.number()]);

export const iSnakeBrainSchema = z.object({
  inputLength: z.number(),
  layerShapes: z.array(layerShapeSchema),
  hiddenLayerActivationFunction: activationFunctionSchema,
  weights: z.array(z.array(z.array(z.number()))),
  biases: z.array(z.array(z.number())),
});

export const optionsSchema = z.object({
  worldWidth: z.number(),
  worldHeight: z.number(),
  snakeBrainConfig: z.object({
    hiddenLayersLength: z.array(z.number()),
    hiddenLayerActivationFunction: activationFunctionSchema,
  }),
  gaConfig: z.object({
    populationSize: z.number(),
    surviveRate: z.number(),
    populationMutationRate: z.number(),
    geneMutationRate: z.number(),
    mutationAmount: z.number(),
    trialTimes: z.number(),
  }),
  providedInfo: z
    .object({
      generation: z.number(),
      snakeBrains: z.array(iSnakeBrainSchema),
    })
    .optional(),
});

export const initModelRequestSchema = z.object({
  options: optionsSchema,
});

export const evolveRequestSchema = z.object({
  times: z.number().min(1),
});

export const toggleBackupPopulationWhenFinishRequestSchema = z.object({
  backup: z.boolean(),
});

export const pollingInfoRequestSchema = z.object({
  currentEvolvingResultHistoryGeneration: z.number(),
  currentPopulationHistoryGeneration: z.number(),
  currentBackupPopulationInProgress: z.boolean(),
  currentBackupPopulationWhenFinish: z.boolean(),
  currentEvolving: z.boolean(),
});

type ISnakeBrainChecking = z.infer<typeof iSnakeBrainSchema> extends ISnakeBrain ? true : false;
const iSnakeBrainChecking: ISnakeBrainChecking = true;
if (!iSnakeBrainChecking) throw new Error("Type checking failed for zod iSnakeBrainSchema");

type OptionsChecking = z.infer<typeof optionsSchema> extends Options ? true : false;
const optionsChecking: OptionsChecking = true;
if (!optionsChecking) throw new Error("Type checking failed for zod optionsSchema");
