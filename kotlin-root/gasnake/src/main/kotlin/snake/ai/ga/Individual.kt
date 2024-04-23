package com.example.snake.ai.ga

import com.example.snake.ai.SnakeBrain
import com.example.snake.game.GameRecord

data class Individual(
    val snakeBrain: SnakeBrain,
    var snakeLength: Double,
    var moves: Double,
    var fitness: Double,
    var survive: Boolean,
    var gameRecord: GameRecord? = null
)