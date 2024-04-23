package com.example.snake.ai.ga.trymodel

import com.example.snake.ai.ga.GaModel
import kotlinx.coroutines.runBlocking
import snake.ai.ga.trymodel.setting

fun main() = runBlocking {
    val printList = mutableListOf<Map<String, Any>>()

    val gaModel = GaModel(setting.gaPlayerConfig, 20)
    for (i in 0 until setting.evolveTimes) {
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

