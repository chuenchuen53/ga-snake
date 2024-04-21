package snake.ai

import com.example.snake.ai.ActivationFunction
import com.example.snake.ai.Options
import com.example.snake.ai.ProvidedWeightsAndBiases
import com.example.snake.ai.SnakeBrain
import com.example.snake.game.typing.Direction
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import kotlin.math.abs

class SnakeBrainTest {

    @Test
    fun `constructor should fail as num of layer is less than 1`() {
        val exception = assertThrows(IllegalArgumentException::class.java) {
            SnakeBrain(
                Options(
                    inputLength = 3,
                    layerShapes = emptyList(),
                    hiddenLayerActivationFunction = ActivationFunction.LINEAR,
                    providedWeightsAndBiases = null
                )
            )
        }
        assert(exception.message == "Invalid layer shapes")
    }

    @Test
    fun `should fail as 1st layer not match with inputLength`() {
        val exception = assertThrows(IllegalArgumentException::class.java) {
            SnakeBrain(
                Options(
                    inputLength = 3,
                    layerShapes = listOf(Pair(4, 4)),
                    hiddenLayerActivationFunction = ActivationFunction.LINEAR,
                    providedWeightsAndBiases = null
                )
            )
        }
        assert(exception.message == "Invalid layer shapes")
    }

    @Test
    fun `should fail as output layer not equal 4`() {
        val exception = assertThrows(IllegalArgumentException::class.java) {
            SnakeBrain(
                Options(
                    inputLength = 3,
                    layerShapes = listOf(Pair(3, 3)),
                    hiddenLayerActivationFunction = ActivationFunction.LINEAR,
                    providedWeightsAndBiases = null
                )
            )
        }
        assert(exception.message == "Invalid layer shapes")
    }

    @Test
    fun `should fail as intermediate layer not match`() {
        val exception = assertThrows(IllegalArgumentException::class.java) {
            SnakeBrain(
                Options(
                    inputLength = 3,
                    layerShapes = listOf(Pair(3, 3), Pair(5, 5), Pair(4, 4)),
                    hiddenLayerActivationFunction = ActivationFunction.LINEAR,
                    providedWeightsAndBiases = null
                )
            )
        }
        assert(exception.message == "Invalid layer shapes")
    }

    @Test
    fun `should create a new SnakeBrain with 1 hidden layer`() {
        val snakeBrain = SnakeBrain(
            Options(
                inputLength = 3,
                layerShapes = listOf(Pair(4, 3)),
                hiddenLayerActivationFunction = ActivationFunction.RELU,
                providedWeightsAndBiases = null
            )
        )

        assertNotNull(snakeBrain)
        assertEquals(3, snakeBrain.inputLength)
        assertEquals(listOf(Pair(4, 3)), snakeBrain.layerShapes)
        assertEquals(ActivationFunction.RELU, snakeBrain.hiddenLayerActivationFunction)
        assertEquals(1, snakeBrain.weights.size)
        assertEquals(4, snakeBrain.weights[0].size)
        assertTrue(snakeBrain.weights[0].all { it.size == 3 })
        assertEquals(1, snakeBrain.biases.size)
        assertEquals(4, snakeBrain.biases[0].size)
        assertTrue(snakeBrain.validateWeightsAndBiases())
    }

    @Test
    fun `should create a new SnakeBrain with 2 hidden layers`() {
        val snakeBrain = SnakeBrain(
            Options(
                inputLength = 5,
                layerShapes = listOf(Pair(7, 5), Pair(4, 7)),
                hiddenLayerActivationFunction = ActivationFunction.LINEAR,
                providedWeightsAndBiases = null
            )
        )

        assertNotNull(snakeBrain)
        assertEquals(5, snakeBrain.inputLength)
        assertEquals(listOf(Pair(7, 5), Pair(4, 7)), snakeBrain.layerShapes)
        assertEquals(ActivationFunction.LINEAR, snakeBrain.hiddenLayerActivationFunction)
        assertEquals(2, snakeBrain.weights.size)
        assertEquals(7, snakeBrain.weights[0].size)
        assertTrue(snakeBrain.weights[0].all { it.size == 5 })
        assertEquals(4, snakeBrain.weights[1].size)
        assertTrue(snakeBrain.weights[1].all { it.size == 7 })
        assertEquals(2, snakeBrain.biases.size)
        assertEquals(7, snakeBrain.biases[0].size)
        assertEquals(4, snakeBrain.biases[1].size)
        assertTrue(snakeBrain.validateWeightsAndBiases())
    }

    @Test
    fun `should create a new SnakeBrain with 3 hidden layers`() {
        val snakeBrain = SnakeBrain(
            Options(
                inputLength = 9,
                layerShapes = listOf(Pair(8, 9), Pair(7, 8), Pair(4, 7)),
                hiddenLayerActivationFunction = ActivationFunction.TANH,
                providedWeightsAndBiases = null
            )
        )

        assertNotNull(snakeBrain)
        assertEquals(9, snakeBrain.inputLength)
        assertEquals(listOf(Pair(8, 9), Pair(7, 8), Pair(4, 7)), snakeBrain.layerShapes)
        assertEquals(ActivationFunction.TANH, snakeBrain.hiddenLayerActivationFunction)
        assertEquals(3, snakeBrain.weights.size)
        assertEquals(8, snakeBrain.weights[0].size)
        assertTrue(snakeBrain.weights[0].all { it.size == 9 })
        assertEquals(7, snakeBrain.weights[1].size)
        assertTrue(snakeBrain.weights[1].all { it.size == 8 })
        assertEquals(4, snakeBrain.weights[2].size)
        assertTrue(snakeBrain.weights[2].all { it.size == 7 })
        assertEquals(3, snakeBrain.biases.size)
        assertEquals(8, snakeBrain.biases[0].size)
        assertEquals(7, snakeBrain.biases[1].size)
        assertEquals(4, snakeBrain.biases[2].size)
        assertTrue(snakeBrain.validateWeightsAndBiases())
    }

    @Test
    fun `should fail as the provided invalid weights and biases`() {
        val exception1 = assertThrows(IllegalArgumentException::class.java) {
            SnakeBrain(
                Options(
                    inputLength = 3,
                    layerShapes = listOf(Pair(4, 3)),
                    hiddenLayerActivationFunction = ActivationFunction.RELU,
                    providedWeightsAndBiases = ProvidedWeightsAndBiases(
                        weights = emptyList(),
                        biases = listOf(mutableListOf(0.1, 0.1, 0.1, 0.1))
                    )
                )
            )
        }
        assert(exception1.message == "Invalid provided weight and bias")

        val exception2 = assertThrows(IllegalArgumentException::class.java) {
            SnakeBrain(
                Options(
                    inputLength = 3,
                    layerShapes = listOf(Pair(4, 3)),
                    hiddenLayerActivationFunction = ActivationFunction.RELU,
                    providedWeightsAndBiases = ProvidedWeightsAndBiases(
                        weights = listOf(
                            listOf(
                                mutableListOf(0.1, 0.1, 0.1),
                                mutableListOf(0.1, 0.1, 0.1),
                                mutableListOf(0.1, 0.1, 0.1),
                                mutableListOf(0.1, 0.1, 0.1)
                            )
                        ),
                        biases = emptyList()
                    )
                )
            )
        }
        assert(exception2.message == "Invalid provided weight and bias")

        val exception3 = assertThrows(IllegalArgumentException::class.java) {
            SnakeBrain(
                Options(
                    inputLength = 3,
                    layerShapes = listOf(Pair(4, 3)),
                    hiddenLayerActivationFunction = ActivationFunction.RELU,
                    providedWeightsAndBiases = ProvidedWeightsAndBiases(
                        weights = listOf(
                            listOf(
                                mutableListOf(0.1, 0.1, 0.1),
                                mutableListOf(0.1, 0.1, 0.1),
                                mutableListOf(0.1, 0.1, 0.1),
                                mutableListOf(0.1, 0.1, 0.1)
                            )
                        ),
                        biases = listOf(mutableListOf(0.1, 0.1))
                    )
                )
            )
        }
        assert(exception3.message == "Invalid provided weight and bias")
    }

    @Test
    fun `compute test 1`() {
        val snakeBrain = SnakeBrain(
            Options(
                inputLength = 2,
                layerShapes = listOf(Pair(5, 2), Pair(4, 5)),
                hiddenLayerActivationFunction = ActivationFunction.LINEAR,
                providedWeightsAndBiases = ProvidedWeightsAndBiases(
                    weights = listOf(
                        listOf(
                            mutableListOf(0.1, 0.15),
                            mutableListOf(0.2, 0.25),
                            mutableListOf(0.3, 0.35),
                            mutableListOf(0.4, 0.45),
                            mutableListOf(0.5, 0.55)
                        ),
                        listOf(
                            mutableListOf(0.1, 0.15, 0.2, 0.25, 0.3),
                            mutableListOf(0.2, 0.25, 0.3, 0.35, 0.4),
                            mutableListOf(0.3, 0.35, 0.4, 0.45, 0.5),
                            mutableListOf(0.4, 0.45, 0.5, 0.55, 0.6)
                        )
                    ),
                    biases = listOf(
                        mutableListOf(0.1, 0.1, 0.1, 0.1, 0.1),
                        mutableListOf(0.1, -0.1, 0.1, -0.1)
                    )
                )
            )
        )

        assertEquals(Direction.LEFT, snakeBrain.compute(listOf(0.1, 0.2)))
        assertEquals(Direction.UP, snakeBrain.compute(listOf(-0.8, -0.7)))
    }

    @Test
    fun `crossOver test 1`() {
        val options = Options(
            inputLength = 2,
            layerShapes = listOf(Pair(5, 2), Pair(4, 5)),
            hiddenLayerActivationFunction = ActivationFunction.LINEAR,
            providedWeightsAndBiases = null
        )
        val parent1 = SnakeBrain(options)
        val parent2 = SnakeBrain(options)
        val child = SnakeBrain(options)

        child.crossOver(parent1, parent2)

        val parent1FlattenedWeightArr = parent1.weights.flatten().flatten()
        val parent1FlattenedBiasesArr = parent1.biases.flatten()

        val parent2FlattenedWeightArr = parent2.weights.flatten().flatten()
        val parent2FlattenedBiasesArr = parent2.biases.flatten()

        val childFlattenedWeightArr = child.weights.flatten().flatten()
        val childFlattenedBiasesArr = child.biases.flatten()

        val minDiffInArr = { x: List<Double>, a: List<Double>, b: List<Double> ->
            x.mapIndexed { index, v -> minOf(abs(v - a[index]), abs(v - b[index])) }
        }

        val diffInWeightArr =
            minDiffInArr(childFlattenedWeightArr, parent1FlattenedWeightArr, parent2FlattenedWeightArr)
        val diffInBiasesArr =
            minDiffInArr(childFlattenedBiasesArr, parent1FlattenedBiasesArr, parent2FlattenedBiasesArr)

        for (x in diffInWeightArr) {
            assertEquals(0.0, x, 0.0001)
        }

        for (x in diffInBiasesArr) {
            assertEquals(0.0, x, 0.0001)
        }
    }

    @Test
    fun `mutate test 1`() {
        val mutationRate = 0.2
        val mutationAmount = 0.05

        val options = Options(
            inputLength = 2,
            layerShapes = listOf(Pair(10000, 2), Pair(4, 10000)),
            hiddenLayerActivationFunction = ActivationFunction.LINEAR,
            providedWeightsAndBiases = null
        )
        val snakeBrain = SnakeBrain(options)

        val originalWeightArr = snakeBrain.weights.flatten().flatten().toList()
        val originalBiasesArr = snakeBrain.biases.flatten().toList()

        snakeBrain.mutate(mutationRate, mutationAmount)

        val mutatedWeightArr = snakeBrain.weights.flatten().flatten()
        val mutatedBiasesArr = snakeBrain.biases.flatten()

        val diffInWeightArr = mutatedWeightArr.mapIndexed { index, v -> abs(v - originalWeightArr[index]) }
        val diffInBiasesArr = mutatedBiasesArr.mapIndexed { index, v -> abs(v - originalBiasesArr[index]) }

        var largerThanZeroCount = 0
        for (x in diffInWeightArr) {
            assertTrue(x <= mutationAmount)
            if (x > 0.000001) {
                largerThanZeroCount++
            }
        }

        var largerThanZeroCount2 = 0
        for (x in diffInBiasesArr) {
            assertTrue(x <= mutationAmount)
            if (x > 0.000001) {
                largerThanZeroCount2++
            }
        }

        val tolerance = 0.01
        assertTrue(abs(largerThanZeroCount.toDouble() / diffInWeightArr.size - mutationRate) < tolerance)
        assertTrue(abs(largerThanZeroCount2.toDouble() / diffInBiasesArr.size - mutationRate) < tolerance)
    }
}