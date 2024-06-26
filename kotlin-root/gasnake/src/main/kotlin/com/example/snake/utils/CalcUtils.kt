package com.example.snake.utils

import com.example.snake.ai.ActivationFunction
import com.example.snake.ai.BaseStats
import java.util.concurrent.ThreadLocalRandom
import kotlin.math.pow
import kotlin.math.sqrt
import kotlin.math.tanh


object CalcUtils {
    fun randomUniform(min: Double, max: Double): Double = ThreadLocalRandom.current().nextDouble(min, max)

    fun randomBool(prob: Double): Boolean = ThreadLocalRandom.current().nextDouble() < prob

    fun hiddenLayerActivation(x: DoubleArray, type: ActivationFunction): DoubleArray = when (type) {
        ActivationFunction.LINEAR -> x
        ActivationFunction.TANH -> DoubleArray(x.size) { tanh(x[it]) }
        ActivationFunction.RELU -> DoubleArray(x.size) { if (x[it] > 0) x[it] else 0.0 }
    }

    fun addition(a: DoubleArray, b: DoubleArray): DoubleArray = DoubleArray(a.size) { a[it] + b[it] }

    fun multiplication(a: List<DoubleArray>, b: DoubleArray): DoubleArray = DoubleArray(a.size) { i ->
        var sum = 0.0
        for (j in a[i].indices) {
            sum += a[i][j] * b[j]
        }
        sum
    }

    fun computeOneLayer(W: List<DoubleArray>, X: DoubleArray, B: DoubleArray): DoubleArray =
        addition(multiplication(W, X), B)

    fun computeMultipleLayer(
        Ws: List<List<DoubleArray>>,
        X: DoubleArray,
        Bs: List<DoubleArray>,
        hiddenLayerActivationFunction: ActivationFunction
    ): DoubleArray {
        var layerOutput = X
        // hidden layer
        for (i in 0 until Ws.size - 1) {
            layerOutput =
                hiddenLayerActivation(computeOneLayer(Ws[i], layerOutput, Bs[i]), hiddenLayerActivationFunction)
        }

        // output layer
        layerOutput = computeOneLayer(Ws.last(), layerOutput, Bs.last())
        return layerOutput
    }

    fun indexOfMaxValueInArray(arr: DoubleArray): Int = arr.indices.maxByOrNull { arr[it] } ?: -1

    fun minmax(min: Double, value: Double, max: Double): Double {
        return when {
            value < min -> min
            value > max -> max
            else -> value
        }
    }

    fun minOfArray(arr: DoubleArray): Double = arr.minOrNull() ?: throw IllegalArgumentException("Array is empty")

    fun maxOfArray(arr: DoubleArray): Double = arr.maxOrNull() ?: throw IllegalArgumentException("Array is empty")

    fun meanOfArray(arr: DoubleArray): Double = arr.average()

    fun sdOfArray(arr: DoubleArray): Double {
        val mean = meanOfArray(arr)
        return sqrt(arr.map { (it - mean).pow(2) }.average())
    }

    fun lowerQuartileOfArray(arr: DoubleArray): Double {
        val sorted = arr.sorted()
        val mid = sorted.size / 4
        return sorted[mid]
    }

    fun medianOfArray(arr: DoubleArray): Double {
        val sorted = arr.sorted()
        val mid = sorted.size / 2
        return sorted[mid]
    }

    fun upperQuartileOfArray(arr: DoubleArray): Double {
        val sorted = arr.sorted()
        val mid = (sorted.size * 3) / 4
        return sorted[mid]
    }

    fun statsOfArray(arr: DoubleArray): BaseStats = BaseStats(
        min = minOfArray(arr),
        max = maxOfArray(arr),
        mean = meanOfArray(arr),
        sd = sdOfArray(arr),
        lowerQuartile = lowerQuartileOfArray(arr),
        median = medianOfArray(arr),
        upperQuartile = upperQuartileOfArray(arr)
    )

    fun binarySearch(prefixSum: List<Double>, value: Double): Int {
        var low = 0
        var high = prefixSum.size - 1
        while (low < high) {
            val mid = low + (high - low) / 2
            if (prefixSum[mid] >= value) high = mid
            else low = mid + 1
        }
        return low
    }

}