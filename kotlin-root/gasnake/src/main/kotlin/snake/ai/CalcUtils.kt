package com.example.snake.ai

import kotlin.math.pow
import kotlin.math.sqrt
import kotlin.math.tanh


object CalcUtils {
    fun hiddenLayerActivation(x: List<Double>, type: ActivationFunction): List<Double> = when (type) {
        ActivationFunction.LINEAR -> x
        ActivationFunction.TANH -> x.map { tanh(it) }
        ActivationFunction.RELU -> x.map { maxOf(0.0, it) }
    }

    fun addition(a: List<Double>, b: List<Double>): List<Double> = a.zip(b) { x, y -> x + y }

    fun multiplication(a: List<List<Double>>, b: List<Double>): List<Double> =
        a.map { it.zip(b).sumOf { pair -> pair.first * pair.second } }

    fun computeOneLayer(W: List<List<Double>>, X: List<Double>, B: List<Double>): List<Double> =
        addition(multiplication(W, X), B)

    fun computeMultipleLayer(
        Ws: List<List<List<Double>>>,
        x: List<Double>,
        Bs: List<List<Double>>,
        hiddenLayerActivationFunction: ActivationFunction
    ): List<Double> {
        var layerOutput = x
        // hidden layer
        for (i in 0 until Ws.size - 1) {
            layerOutput =
                hiddenLayerActivation(computeOneLayer(Ws[i], layerOutput, Bs[i]), hiddenLayerActivationFunction)
        }

        // output layer
        layerOutput = computeOneLayer(Ws.last(), layerOutput, Bs.last())
        return layerOutput
    }

    fun indexOfMaxValueInArray(arr: List<Double>): Int = arr.indices.maxByOrNull { arr[it] } ?: -1

    fun minmax(min: Double, value: Double, max: Double): Double {
        return when {
            value < min -> min
            value > max -> max
            else -> value
        }
    }

    fun minOfArray(arr: List<Double>): Double {
        return arr.minOrNull() ?: throw IllegalArgumentException("Array is empty")
    }

    fun maxOfArray(arr: List<Double>): Double {
        return arr.maxOrNull() ?: throw IllegalArgumentException("Array is empty")
    }

    fun meanOfArray(arr: List<Double>): Double {
        return arr.average()
    }

    fun sdOfArray(arr: List<Double>): Double {
        val mean = meanOfArray(arr)
        return sqrt(arr.map { (it - mean).pow(2) }.average())
    }

    fun lowerQuartileOfArray(arr: List<Double>): Double {
        val sorted = arr.sorted()
        val mid = sorted.size / 4
        return sorted[mid]
    }

    fun medianOfArray(arr: List<Double>): Double {
        val sorted = arr.sorted()
        val mid = sorted.size / 2
        return sorted[mid]
    }

    fun upperQuartileOfArray(arr: List<Double>): Double {
        val sorted = arr.sorted()
        val mid = (sorted.size * 3) / 4
        return sorted[mid]
    }

    fun statsOfArray(arr: List<Double>): BaseStats = BaseStats(
        min = minOfArray(arr),
        max = maxOfArray(arr),
        mean = meanOfArray(arr),
        sd = sdOfArray(arr),
        lowerQuartile = lowerQuartileOfArray(arr),
        median = medianOfArray(arr),
        upperQuartile = upperQuartileOfArray(arr)
    )

}