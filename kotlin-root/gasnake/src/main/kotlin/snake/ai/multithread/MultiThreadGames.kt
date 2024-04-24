package snake.ai.multithread

import com.example.snake.ai.InputLayer
import com.example.snake.ai.ProvidedWeightsAndBiases
import com.example.snake.ai.SnakeBrain
import com.example.snake.ai.SnakeBrainData
import com.example.snake.ai.multithread.WorkerResult
import com.example.snake.game.GameRecord
import com.example.snake.game.Options
import com.example.snake.game.SnakeGame
import kotlinx.coroutines.*
import java.util.concurrent.Callable
import java.util.concurrent.Executors
import java.util.concurrent.ForkJoinPool
import java.util.concurrent.Future
import java.util.function.Supplier
import java.util.stream.Collectors

class MultiThreadGames(numOfThreads: Int) {
    private val executorService = Executors.newWorkStealingPool(numOfThreads)
    private val workerThreadPool = ForkJoinPool(Runtime.getRuntime().availableProcessors())

    fun playGames(
        worldWidth: Int,
        worldHeight: Int,
        playTimes: Int,
        snakeBrainData: SnakeBrainData
    ): Future<WorkerResult> {
        val task = Callable {
            val snakeLengthArr = IntArray(playTimes)
            val movesArr = IntArray(playTimes)
            val gameRecordArr = Array<GameRecord?>(playTimes) { null }

            val snakeGame = SnakeGame(Options(worldWidth, worldHeight, null))
            val inputLayer = InputLayer(snakeGame)
            val snakeBrain = SnakeBrain(
                com.example.snake.ai.Options(
                    inputLength = snakeBrainData.inputLength,
                    layerShapes = snakeBrainData.layerShapes,
                    hiddenLayerActivationFunction = snakeBrainData.hiddenLayerActivationFunction,
                    providedWeightsAndBiases = ProvidedWeightsAndBiases(
                        snakeBrainData.weights.map { layer -> layer.map { it.clone() } },
                        snakeBrainData.biases.map { it.clone() }
                    )
                ))
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

            val nonNullGameRecordArr = gameRecordArr.filterNotNull().toTypedArray()
            WorkerResult(snakeLengthArr, movesArr, nonNullGameRecordArr)
        }

        return executorService.submit(task)
    }

    fun playManyGames(
        worldWidth: Int,
        worldHeight: Int,
        playTimes: Int,
        snakeBrainList: List<SnakeBrain>
    ): Future<List<WorkerResult>> = workerThreadPool.submit(
        Callable {
            val tasks = snakeBrainList.map { brain ->
                Supplier {
                    playGame(worldWidth, worldHeight, playTimes, brain)
                }
            }
            tasks.parallelStream()
                .map { it.get() }
                .collect(Collectors.toList())
        }
    )

    private fun playGame(
        worldWidth: Int,
        worldHeight: Int,
        playTimes: Int,
        snakeBrain: SnakeBrain
    ): WorkerResult {
        val snakeLengthArr = IntArray(playTimes)
        val movesArr = IntArray(playTimes)
        val gameRecordArr = Array<GameRecord?>(playTimes) { null }

        val snakeGame = SnakeGame(Options(worldWidth, worldHeight, null))
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

        val nonNullGameRecordArr = gameRecordArr.filterNotNull().toTypedArray()
        return WorkerResult(snakeLengthArr, movesArr, nonNullGameRecordArr)
    }

    suspend fun sPlayGame(
        worldWidth: Int,
        worldHeight: Int,
        playTimes: Int,
        snakeBrain: SnakeBrain
    ) = coroutineScope {
        playGame(worldWidth, worldHeight, playTimes, snakeBrain)
    }

    fun playManyGamesAsync(
        worldWidth: Int,
        worldHeight: Int,
        trialTimes: Int,
        snakeBrainList: List<SnakeBrain>
    ): Deferred<List<WorkerResult>> {

        return GlobalScope.async {
            snakeBrainList.map { snakeBrain ->
                async {
                    sPlayGame(worldWidth, worldHeight, trialTimes, snakeBrain)
                }
            }.awaitAll()
        }
    }

    fun destroy() {
        executorService.shutdownNow()
        workerThreadPool.shutdown()
    }
}