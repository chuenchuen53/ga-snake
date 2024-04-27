package com.example.snake.ai.ga

import com.example.snake.ai.SnakeBrain
import com.example.snake.game.GameRecord

// snakeLength, moves are calculated by average of trial games, so they are Double
data class Individual(
    val snakeBrain: SnakeBrain,
    var snakeLength: Double,
    var moves: Double,
    var fitness: Double,
    var survive: Boolean,
    var gameRecord: GameRecord? = null
)