package com.example.snake.ai.ga.trymodel

import com.example.snake.ai.ActivationFunction
import com.example.snake.ai.ga.GaConfig
import com.example.snake.ai.ga.Options
import com.example.snake.ai.ga.SnakeBrainConfig

data class Setting(
    val evolveTimes: Int,
    val gaPlayerConfig: Options
)

val setting = com.example.snake.ai.ga.trymodel.Setting(
    evolveTimes = 2000,
    gaPlayerConfig = Options(
        worldWidth = 20,
        worldHeight = 20,
        snakeBrainConfig = SnakeBrainConfig(
            hiddenLayersLength = listOf(16, 8),
            hiddenLayerActivationFunction = ActivationFunction.LINEAR
        ),
        gaConfig = GaConfig(
            populationSize = 5000,
            surviveRate = 0.5,
            populationMutationRate = 0.2,
            geneMutationRate = 0.5,
            mutationAmount = 0.2,
            trialTimes = 1
        )
    )
)