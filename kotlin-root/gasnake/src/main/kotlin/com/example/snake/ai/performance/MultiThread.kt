package com.example.snake.ai.performance


import com.example.snake.ai.Options
import com.example.snake.ai.ProvidedWeightsAndBiases
import com.example.snake.ai.SnakeBrain
import com.example.snake.ai.SnakeBrainData
import com.example.snake.ai.multithread.MultiThreadGames
import com.example.snake.game.SnakeGame
import com.google.gson.Gson
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.InputStreamReader
import kotlin.system.measureTimeMillis

suspend fun main() {
    val inputStream = Thread.currentThread().contextClassLoader.getResourceAsStream("trained-brain.json")
        ?: throw IllegalArgumentException("Resource not found")
    val reader = InputStreamReader(inputStream)
    val brainData: SnakeBrainData = Gson().fromJson(reader, SnakeBrainData::class.java)
    withContext(Dispatchers.IO) { reader.close() }

    val snakeBrain = SnakeBrain(
        Options(
            brainData.inputLength,
            brainData.layerShapes,
            brainData.hiddenLayerActivationFunction,
            ProvidedWeightsAndBiases(
                brainData.weights,
                brainData.biases
            )
        )
    )

    val multiThreadGames = MultiThreadGames()

    val games = 10000
    val snakeGame = List(games) { SnakeGame(com.example.snake.game.Options(20, 20, null)) }
    val snakeBrains = List(games) { snakeBrain }
    val gameAndBrainList = snakeGame.zip(snakeBrains)
    val scores = mutableListOf<Int>()

    val execTime = measureTimeMillis {
        val workerResults = multiThreadGames.playManyGames(1, gameAndBrainList)
        scores.addAll(workerResults.map { it.snakeLengthArr.average().toInt() })
    }

    println("Total time: ${"%.3f".format(execTime.toDouble() / 1000)}s")

    val bestScore = scores.maxOrNull() ?: 0
    println("Best score: $bestScore")

    val avgScore = scores.average()
    println("Average score: ${"%.2f".format(avgScore)}")
}