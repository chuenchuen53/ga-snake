package com.example.spring.response.shared

import com.example.snake.ai.ga.IndividualPlainObject
import com.example.snake.ai.ga.OverallStats

data class EvolveResultWithId(
    val _id: String,
    val generation: Int,
    val bestIndividual: IndividualPlainObject,
    val timeSpent: Double,
    val overallStats: OverallStats
)