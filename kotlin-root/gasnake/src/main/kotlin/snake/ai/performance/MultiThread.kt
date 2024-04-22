package com.example.snake.ai.performance


import com.example.snake.ai.ProvidedWeightsAndBiases
import com.example.snake.ai.SnakeBrain
import com.example.snake.ai.SnakeBrainData
import com.google.gson.Gson
import snake.ai.multithread.MultiThreadGames
import java.io.InputStreamReader

fun main() {
    val inputStream = Thread.currentThread().contextClassLoader.getResourceAsStream("trained-brain.json")
        ?: throw IllegalArgumentException("Resource not found")
    val reader = InputStreamReader(inputStream)
    val brainData: SnakeBrainData = Gson().fromJson(reader, SnakeBrainData::class.java)
    reader.close()

    val snakeBrain = SnakeBrain(
        com.example.snake.ai.Options(
            brainData.inputLength,
            brainData.layerShapes,
            brainData.hiddenLayerActivationFunction,
            ProvidedWeightsAndBiases(
                brainData.weights,
                brainData.biases
            )
        )
    )

    val multiThreadGames = MultiThreadGames(10)

    val games = 10000
    val snakeBrains = List(games) { snakeBrain }
    val scores = mutableListOf<Int>()

    val execTime = TimingUtils.execTime {
        val resultFutures = snakeBrains.map { multiThreadGames.playGames(20, 20, 1, it.toPlainObject()) }
        val workerResults = resultFutures.map { it.get() }
        scores.addAll(workerResults.map { it.snakeLengthArr.average().toInt() })
    }

    val totalTime = execTime
    println("Total time: ${"%.3f".format(totalTime)}s")

    val bestScore = scores.maxOrNull() ?: 0
    println("Best score: $bestScore")

    val avgScore = scores.average()
    println("Average score: ${"%.2f".format(avgScore)}")

    multiThreadGames.destroy()
}