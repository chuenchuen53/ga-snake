import { z } from "zod";
import { ActivationFunction } from "snake-ai/CalcUtils";
import type { Options } from "snake-ai/GaModel";

export const activationFunctionSchema = z.nativeEnum(ActivationFunction);

export const layerShapeSchema = z.array(z.number());

export const iSnakeBrainSchema = z.object({
  inputLength: z.number(),
  layerShapes: z.array(layerShapeSchema),
  hiddenLayerActivationFunction: activationFunctionSchema,
  weightArr: z.array(z.array(z.array(z.number()))),
  biasesArr: z.array(z.array(z.number())),
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

export const toggleBackupPopulationRequestSchema = z.object({
  backup: z.boolean(),
});

type Checking = z.infer<typeof optionsSchema> extends Options ? true : false;
const checking: Checking = true;
if (!checking) throw new Error("Type checking failed for zod optionsSchema");
