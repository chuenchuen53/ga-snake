package com.example.snake.ai.performance


import com.example.snake.ai.Options
import com.example.snake.ai.ProvidedWeightsAndBiases
import com.example.snake.ai.SnakeBrain
import com.example.snake.ai.SnakeBrainData
import com.google.gson.Gson
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import snake.ai.multithread.MultiThreadGames
import java.io.InputStreamReader

suspend fun main() {
    val inputStream = Thread.currentThread().contextClassLoader.getResourceAsStream("trained-brain.json")
        ?: throw IllegalArgumentException("Resource not found")
    val reader = InputStreamReader(inputStream)
    val brainData: SnakeBrainData = Gson().fromJson(reader, SnakeBrainData::class.java)
    reader.close()

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

    val multiThreadGames = MultiThreadGames(10)

    val games = 10000
    val snakeBrains = List(games) { snakeBrain }
    val scores = mutableListOf<Int>()

    val start = System.nanoTime()

    coroutineScope { // Provides a scope for new coroutines
        val deferredResults = async {
            multiThreadGames.playManyGamesAsync(20, 20, 1, snakeBrains).await()
        }

        // Await asynchronously for the computation to finish and get the results
        val workerResults = deferredResults.await()

        // Add the average snake length to the scores list
        scores.addAll(workerResults.map { it.snakeLengthArr.average().toInt() })
    }

    val end = System.nanoTime()

    val execTime = TimingUtils.execTime {
        val futureList = multiThreadGames.playManyGames(20, 20, 1, snakeBrains)
        val workerResults = futureList.get()

        scores.addAll(workerResults.map { it.snakeLengthArr.average().toInt() })
    }
    println("Total time: ${"%.3f".format(execTime)}s")


    val totalTime = (end - start) / 1e9
//    val totalTime = execTime
    println("Total time: ${"%.3f".format(totalTime)}s")

    val bestScore = scores.maxOrNull() ?: 0
    println("Best score: $bestScore")

    val avgScore = scores.average()
    println("Average score: ${"%.2f".format(avgScore)}")

    multiThreadGames.destroy()
}