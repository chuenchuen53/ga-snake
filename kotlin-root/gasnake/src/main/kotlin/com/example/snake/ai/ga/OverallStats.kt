package com.example.snake.ai.ga

import com.example.snake.ai.BaseStats

data class OverallStats(
    val fitness: BaseStats,
    val snakeLength: BaseStats,
    val moves: BaseStats
)