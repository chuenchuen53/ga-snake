package com.example.spring.request

import com.example.snake.ai.ActivationFunction
import com.example.snake.ai.SnakeBrainData

data class InitModelRequest(
    val options: Options
) {
    data class Options(
        val worldWidth: Int,
        val worldHeight: Int,
        val snakeBrainConfig: SnakeBrainConfig,
        val gaConfig: GaConfig,
        val providedInfo: ProvidedInfo?
    ) {
        data class SnakeBrainConfig(
            val hiddenLayersLength: List<Int>,
            val hiddenLayerActivationFunction: ActivationFunction
        )

        data class GaConfig(
            val populationSize: Int,
            val surviveRate: Double,
            val populationMutationRate: Double,
            val geneMutationRate: Double,
            val mutationAmount: Double,
            val trialTimes: Int
        )

        data class ProvidedInfo(
            val generation: Int,
            val snakeBrains: List<SnakeBrainData>
        )
    }
}
