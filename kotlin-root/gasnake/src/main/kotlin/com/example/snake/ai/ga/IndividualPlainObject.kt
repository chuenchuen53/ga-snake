package com.example.snake.ai.ga

import com.example.snake.ai.SnakeBrainData
import com.example.snake.game.GameRecord

// snakeLength, moves are calculated by average of trial games, so they are Double
data class IndividualPlainObject(
    val snakeBrain: SnakeBrainData,
    val snakeLength: Double,
    val moves: Double,
    val fitness: Double,
    val survive: Boolean,
    val gameRecord: GameRecord? = null
)