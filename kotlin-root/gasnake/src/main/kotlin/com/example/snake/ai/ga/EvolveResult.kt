package com.example.snake.ai.ga


data class EvolveResult(
    val generation: Int,
    val bestIndividual: IndividualPlainObject,
    val timeSpent: Long,
    val overallStats: OverallStats
)
