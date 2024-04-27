package snake.ai

import com.example.snake.ai.ActivationFunction
import com.example.snake.ai.Options
import com.example.snake.ai.SnakeBrain
import com.example.snake.ai.ga.GaModel
import com.example.snake.ai.ga.Individual
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

    @Test
    fun `spinRouletteWheel should produce expected ratio for given fitnessArr`() {
        testCases.forEach { fitnessArr ->
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
            for (i in 0 until times) {
                val result = GaModel.spinRouletteWheel(population)
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