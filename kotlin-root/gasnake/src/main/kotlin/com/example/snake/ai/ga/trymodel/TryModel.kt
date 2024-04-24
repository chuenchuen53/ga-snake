package com.example.snake.ai.ga.trymodel

import com.example.snake.ai.ga.GaModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

fun main() = runBlocking {
    val printList = mutableListOf<Map<String, Any>>()

    val gaModel = GaModel(com.example.snake.ai.ga.trymodel.setting.gaPlayerConfig, 20)

    launch(Dispatchers.Default) {
        for (i in 0 until com.example.snake.ai.ga.trymodel.setting.evolveTimes) {
            val result = gaModel.evolve()
            printList.add(
                mapOf(
                    "generation" to i,
                    "bestFitness" to result.bestIndividual.fitness,
                    "bestLength" to result.bestIndividual.snakeLength,
                    "meanFitness" to result.overallStats.fitness.mean,
                    "meanLength" to result.overallStats.snakeLength.mean,
                    "timeSpent" to result.timeSpent
                )
            )
            println(printList.last())
        }
    }

    Unit
}