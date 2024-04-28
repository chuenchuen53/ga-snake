package snake.ai

import com.example.snake.ai.ActivationFunction
import com.example.snake.ai.Options
import com.example.snake.ai.SnakeBrain
import com.example.snake.ai.ga.GaModel
import com.example.snake.ai.ga.Individual
import com.example.snake.game.SnakeGame
import org.junit.jupiter.api.Assertions.assertTrue
import kotlin.test.Test
import kotlin.test.assertEquals

class GaModelTest {
    private val testCases = listOf(
        listOf(15, 20, 94, 18, 35),
        listOf(1000, 500, 200, 100),
        listOf(123, 2222, 378, 78090),
        listOf(15, 20, 94, 18, 35, 50, 79),
        listOf(79, 50, 35, 18, 94, 20, 15)
    )

    private val cumulativeSums = listOf(
        listOf(15, 35, 129, 147, 182),
        listOf(1000, 1500, 1700, 1800),
        listOf(123, 2345, 2723, 80813),
        listOf(15, 35, 129, 147, 182, 232, 311),
        listOf(79, 129, 164, 182, 276, 296, 311),
    )

    @Test
    fun `calculateCumulativeSum should produce expected cumulative sum for given values`() {
        testCases.forEachIndexed { index, values ->
            val result = GaModel.calculateCumulativeSum(values.map { it.toDouble() })
            assertEquals(cumulativeSums[index].map { it.toDouble() }, result)
        }
    }

    @Test
    fun `spinRouletteWheel should produce expected ratio for given fitnessArr`() {
        testCases.forEach { fitnessArr ->
            val snakeGame = SnakeGame(
                options = com.example.snake.game.Options(
                    worldWidth = 20,
                    worldHeight = 20,
                    providedInitialStatus = null
                )
            )
            val snakeBrain = SnakeBrain(
                Options(
                    inputLength = 10,
                    layerShapes = listOf(
                        listOf(8, 10),
                        listOf(4, 8),
                    ),
                    hiddenLayerActivationFunction = ActivationFunction.LINEAR,
                    providedWeightsAndBiases = null,
                )
            )
            val population = fitnessArr.map { fitness ->
                Individual(
                    snakeGame = snakeGame,
                    snakeBrain = snakeBrain,
                    fitness = fitness.toDouble(),
                    snakeLength = 0.0,
                    moves = 0.0,
                    survive = false,
                    gameRecord = null
                )
            }

            val count = fitnessArr.map { 0 }.toMutableList()
            val times = 100000
            val cumulativeSumList = GaModel.calculateCumulativeSum(fitnessArr.map { it.toDouble() })
            for (i in 0 until times) {
                val result = GaModel.spinRouletteWheel(population, cumulativeSumList)
                count[fitnessArr.indexOf(result.fitness.toInt())]++
            }

            assertEquals(count.sum(), times)

            val ratio = count.map { it.toDouble() / times }
            val tolerance = 0.02
            val sumOfFitness = fitnessArr.sum()
            val idealRatio = fitnessArr.map { it.toDouble() / sumOfFitness }

            for (i in ratio.indices) {
                assertTrue(ratio[i] > idealRatio[i] - tolerance)
                assertTrue(ratio[i] < idealRatio[i] + tolerance)
            }
        }
    }

    @Test
    fun `fitness test 1`() {
        // assume worldWidth = 20, worldHeight = 20, max possible snake length = 400
        // ensure fitness is less than max possible number / 1e8
        val moves = 1000
        val snakeLength = 400

        val fitness = GaModel.fitness(moves, snakeLength, 400)
        assertTrue(fitness < Double.MAX_VALUE / 1e8)
    }
}