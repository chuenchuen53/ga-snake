package com.example.snake.ai.performance


import com.example.snake.ai.InputLayer
import com.example.snake.ai.ProvidedWeightsAndBiases
import com.example.snake.ai.SnakeBrain
import com.example.snake.ai.SnakeBrainData
import com.example.snake.game.Options
import com.example.snake.game.SnakeGame
import com.google.gson.Gson
import java.io.InputStreamReader
import kotlin.system.measureTimeMillis

data class Result(val score: Int, val execTime: Long)

fun main() {
    val inputStream = Thread.currentThread().contextClassLoader.getResourceAsStream("trained-brain.json")
        ?: throw IllegalArgumentException("Resource not found")
    val reader = InputStreamReader(inputStream)
    val brainData: SnakeBrainData = Gson().fromJson(reader, SnakeBrainData::class.java)
    reader.close()

    val snakeGame = SnakeGame(Options(20, 20, null))
    val inputLayer = InputLayer(snakeGame)
    val snakeBrain = SnakeBrain(
        com.example.snake.ai.Options(
            brainData.inputLength,
            brainData.layerShapes,
            brainData.hiddenLayerActivationFunction,
            ProvidedWeightsAndBiases(
                brainData.weights.map { layer -> layer.map { it.clone() } },
                brainData.biases.map { it.clone() }
            )
        )
    )

    val games = 1000
    val result = mutableListOf<Result>()

    for (i in 0 until games) {
        snakeGame.reset()

        val execTime = measureTimeMillis {
            while (!snakeGame.gameOver) {
                val input = inputLayer.compute()
                val direction = snakeBrain.compute(input)
                snakeGame.snakeMoveByDirection(direction)
            }
        }

        result.add(Result(snakeGame.snake.length, execTime))
    }

    val totalTime = result.sumOf { it.execTime }.toDouble() / 1000
    println("Total time: ${"%.3f".format(totalTime)}s")

    val bestScore = result.maxByOrNull { it.score }?.score ?: 0
    println("Best score: $bestScore")

    val avgScore = result.sumOf { it.score } / games
    println("Average score: $avgScore")
}