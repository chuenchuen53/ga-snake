package com.example.snake.game

import kotlin.random.Random


object Utils {
    fun randomUniform(min: Double, max: Double): Double = Random.nextDouble(min, max)

    fun randomBool(prob: Double): Boolean = Random.nextDouble() < prob
}