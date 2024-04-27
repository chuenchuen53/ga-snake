package com.example.snake.ai.multithread

import com.example.snake.ai.InputLayer
import com.example.snake.ai.SnakeBrain
import com.example.snake.game.GameRecord
import com.example.snake.game.SnakeGame
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.coroutineScope

class MultiThreadGames {
    suspend fun playManyGames(
        playTimes: Int,
        gameAndBrainList: List<Pair<SnakeGame, SnakeBrain>>
    ): List<WorkerResult> = coroutineScope {
        gameAndBrainList.map {
            async { playGame(playTimes, it.first, it.second) }
        }.awaitAll()
    }

    private suspend fun playGame(
        playTimes: Int,
        snakeGame: SnakeGame,
        snakeBrain: SnakeBrain
    ): WorkerResult = coroutineScope {
        val snakeLengthArr = IntArray(playTimes)
        val movesArr = IntArray(playTimes)
        val gameRecordArr = Array<GameRecord?>(playTimes) { null }

        val inputLayer = InputLayer(snakeGame)

        for (i in 0 until playTimes) {
            snakeGame.reset()
            do {
                val direction = snakeBrain.compute(inputLayer.compute())
                snakeGame.snakeMoveByDirection(direction)
            } while (!snakeGame.gameOver)

            snakeLengthArr[i] = snakeGame.snake.length
            movesArr[i] = snakeGame.moves
            gameRecordArr[i] = snakeGame.exportGameRecord()
        }

        val nonNullGameRecordArr = gameRecordArr.mapNotNull { it }.toTypedArray()
        WorkerResult(snakeLengthArr, movesArr, nonNullGameRecordArr)
    }
}