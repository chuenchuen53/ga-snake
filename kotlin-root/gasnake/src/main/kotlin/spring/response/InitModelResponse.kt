package com.example.spring.response

import com.example.snake.ai.ActivationFunction
import com.example.spring.response.shared.EvolveResultWithId
import com.example.spring.response.shared.PopulationHistory

data class InitModelResponse(val modelInfo: ModelInfo) {

    data class ModelInfo(
        val _id: String,
        val worldWidth: Int,
        val worldHeight: Int,
        val hiddenLayersLength: List<Int>,
        val hiddenLayerActivationFunction: ActivationFunction,
        val populationSize: Int,
        val surviveRate: Double,
        val populationMutationRate: Double,
        val geneMutationRate: Double,
        val mutationAmount: Double,
        val trialTimes: Int,
        val generation: Int,
        val evolveResultHistory: List<EvolveResultWithId>,
        val populationHistory: List<PopulationHistory>,
    )
}
