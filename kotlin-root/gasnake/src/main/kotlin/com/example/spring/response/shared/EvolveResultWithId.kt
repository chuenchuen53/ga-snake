package com.example.spring.response.shared

import com.example.snake.ai.ga.IndividualPlainObject

data class EvolveResultWithId(
    val _id: String,
    val generation: Int,
    val bestIndividual: IndividualPlainObject,
    val timeSpent: Double,
    val overallStats: com.example.snake.ai.ga.OverallStats
)