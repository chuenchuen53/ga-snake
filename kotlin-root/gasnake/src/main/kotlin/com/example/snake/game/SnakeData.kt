package com.example.snake.game

data class SnakeData(
    val positions: List<Position>,
    val direction: Direction,
    val allPositions2D: List<List<Position>>
)