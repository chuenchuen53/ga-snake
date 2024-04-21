package com.example.snake.game

import kotlin.random.Random


object Utils {
    inline fun <reified EnumMap : Enum<EnumMap>> enumToArray(): Array<EnumMap> {
        return enumValues()
    }

    fun randomUniform(min: Double, max: Double): Double {
        return Random.nextDouble(min, max)
    }

    fun randomInteger(min: Int, max: Int): Int {
        return Random.nextInt(min, max + 1)
    }

    fun <T> randomItemFromArray(array: Array<T>): T {
        return array[randomInteger(0, array.size - 1)]
    }

    inline fun <reified EnumMap : Enum<EnumMap>> randomItemFromEnum(): EnumMap {
        return randomItemFromArray(enumToArray())
    }

    fun randomBool(prob: Double): Boolean {
        return Random.nextDouble() < prob
    }

    fun <T> clone1dArr(arr: Array<T>): Array<T> {
        return arr.copyOf()
    }

    fun clone2DArr(arr: Array<DoubleArray>): Array<DoubleArray> {
        return Array(arr.size) { i -> arr[i].clone() }
    }

    fun clone3DArr(arr: Array<Array<DoubleArray>>): Array<Array<DoubleArray>> {
        return Array(arr.size) { i ->
            Array(arr[i].size) { j ->
                arr[i][j].clone()
            }
        }
    }
}