package com.example.snake.ai.ga

import com.example.snake.ai.ActivationFunction

data class GaModelData(
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
    val population: List<IndividualPlainObject>
)