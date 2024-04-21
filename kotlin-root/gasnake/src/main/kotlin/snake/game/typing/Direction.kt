package com.example.snake.game.typing

enum class Direction(val value: Int) {
    UP(0),
    DOWN(1),
    LEFT(2),
    RIGHT(3);

    val opposite: Direction
        get() = when (this) {
            UP -> DOWN
            DOWN -> UP
            LEFT -> RIGHT
            RIGHT -> LEFT
        }

    companion object {
        fun inverseDirectionMap(value: Int): Direction = when (value) {
            0 -> UP
            1 -> DOWN
            2 -> LEFT
            3 -> RIGHT
            else -> throw IllegalArgumentException("Invalid value for Direction: $value")
        }
    }
}