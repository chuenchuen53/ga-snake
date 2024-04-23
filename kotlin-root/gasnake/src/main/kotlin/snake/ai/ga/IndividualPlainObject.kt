package com.example.snake.ai.ga

import com.example.snake.ai.SnakeBrainData
import com.example.snake.game.GameRecord

data class IndividualPlainObject(
    val snakeBrain: SnakeBrainData,
    var snakeLength: Double,
    var moves: Double,
    var fitness: Double,
    var survive: Boolean,
    var gameRecord: GameRecord? = null
)