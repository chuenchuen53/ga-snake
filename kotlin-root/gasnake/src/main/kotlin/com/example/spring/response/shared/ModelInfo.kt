package com.example.spring.response.shared

import com.example.snake.ai.ActivationFunction

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