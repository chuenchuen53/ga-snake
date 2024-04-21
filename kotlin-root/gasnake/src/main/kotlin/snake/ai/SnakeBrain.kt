package com.example.snake.ai

import com.example.snake.game.Utils
import com.example.snake.game.typing.Direction
import kotlin.random.Random

typealias LayerShape = Pair<Int, Int>

data class ProvidedWeightsAndBiases(
    val weights: List<List<DoubleArray>>,
    val biases: List<DoubleArray>
)

data class Options(
    val inputLength: Int,
    val layerShapes: List<LayerShape>,
    val hiddenLayerActivationFunction: ActivationFunction,
    val providedWeightsAndBiases: ProvidedWeightsAndBiases?
)

data class SnakeBrainData(
    val inputLength: Int,
    val layerShapes: List<LayerShape>,
    val hiddenLayerActivationFunction: ActivationFunction,
    val weights: List<List<DoubleArray>>,
    val biases: List<DoubleArray>
)


class SnakeBrain(options: Options) {
    companion object {
        const val OUTPUT_LAYER_LENGTH = 4
        const val MIN_WEIGHT = -1.0
        const val MAX_WEIGHT = 1.0
        const val MIN_BIAS = -1.0
        const val MAX_BIAS = 1.0

        fun crossOverNumber(a: Double, b: Double): Double {
            return if (Random.nextBoolean()) a else b
        }
    }

    val inputLength: Int = options.inputLength
    val layerShapes: List<LayerShape> = options.layerShapes
    val hiddenLayerActivationFunction: ActivationFunction = options.hiddenLayerActivationFunction
    var weights: List<List<DoubleArray>>
    var biases: List<DoubleArray>

    init {
        if (!validateLayerShapes()) throw IllegalArgumentException("Invalid layer shapes")

        if (options.providedWeightsAndBiases != null) {
            // todo check immutability problem
            weights = options.providedWeightsAndBiases.weights
            biases = options.providedWeightsAndBiases.biases
            if (!validateWeightsAndBiases()) throw IllegalArgumentException("Invalid provided weight and bias")
        } else {
            weights = layerShapes.map { generateRandomLayerWeight(it) }
            biases = layerShapes.map { generateRandomLayerBias(it) }
        }
    }

    fun toPlainObject(): SnakeBrainData = SnakeBrainData(
        inputLength = inputLength,
        layerShapes = layerShapes,
        hiddenLayerActivationFunction = hiddenLayerActivationFunction,
        weights = weights.map { x -> x.map { y -> y.clone() } },
        biases = biases.map { it.clone() }
    )

    fun validateWeightsAndBiases(): Boolean {
        if (weights.isEmpty() || biases.isEmpty()) return false
        if (weights.size != biases.size) return false
        if (weights.size != layerShapes.size) return false
        if (weights[0][0].size != inputLength) return false
        if (weights.last().size != OUTPUT_LAYER_LENGTH) return false
        if (weights.flatten().any { arr -> arr.any { it < MIN_WEIGHT || it > MAX_WEIGHT } }) return false
        if (biases.any { arr -> arr.any { it < MIN_BIAS || it > MAX_BIAS } }) return false

        for (i in 1 until weights.size) {
            if (weights[i].size != layerShapes[i].first) return false
            if (weights[i][0].size != layerShapes[i].second) return false
        }

        for (i in biases.indices) {
            if (biases[i].size != layerShapes[i].first) return false
        }

        return true
    }

    fun compute(input: DoubleArray): Direction {
        val output = CalcUtils.computeMultipleLayer(weights, input, biases, hiddenLayerActivationFunction)
        val index = CalcUtils.indexOfMaxValueInArray(output)
        return Direction.inverseDirectionMap(index)
    }

    fun crossOver(a: SnakeBrain, b: SnakeBrain) {
        for (layerIndex in weights.indices) {
            val weight = weights[layerIndex]
            val bias = biases[layerIndex]

            for (row in weight.indices) {
                for (col in weight[row].indices) {
                    weight[row][col] = crossOverNumber(a.weights[layerIndex][row][col], b.weights[layerIndex][row][col])
                }

                bias[row] = crossOverNumber(a.biases[layerIndex][row], b.biases[layerIndex][row])
            }
        }
    }

    fun mutate(mutationRate: Double, mutationAmount: Double) {
        for (layerIndex in weights.indices) {
            val weight = weights[layerIndex]
            val bias = biases[layerIndex]

            for (row in weight.indices) {
                for (col in weight[row].indices) {
                    if (Utils.randomBool(mutationRate)) {
                        val newValue = weight[row][col] + Utils.randomUniform(-mutationAmount, mutationAmount)
                        weight[row][col] = CalcUtils.minmax(MIN_WEIGHT, newValue, MAX_WEIGHT)
                    }
                }

                if (Utils.randomBool(mutationRate)) {
                    val newValue = bias[row] + Utils.randomUniform(-mutationAmount, mutationAmount)
                    bias[row] = CalcUtils.minmax(MIN_BIAS, newValue, MAX_BIAS)
                }
            }
        }
    }

    private fun validateLayerShapes(): Boolean {
        val numOfLayer = layerShapes.size

        if (numOfLayer < 1) return false

        if (layerShapes[0].second != inputLength) return false

        if (layerShapes[numOfLayer - 1].first != OUTPUT_LAYER_LENGTH) return false

        for (i in 1 until numOfLayer) {
            if (layerShapes[i].second != layerShapes[i - 1].first) return false
        }

        return true
    }

    private fun generateRandomLayerWeight(layerShape: LayerShape): List<DoubleArray> {
        val (row, col) = layerShape
        return List(row) { DoubleArray(col) { Random.nextDouble(MIN_WEIGHT, MAX_WEIGHT) } }
    }

    private fun generateRandomLayerBias(layerShape: LayerShape): DoubleArray {
        val (row, _) = layerShape
        return DoubleArray(row) { Random.nextDouble(MIN_BIAS, MAX_BIAS) }
    }
}