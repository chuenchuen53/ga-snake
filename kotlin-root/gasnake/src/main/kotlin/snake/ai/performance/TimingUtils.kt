package com.example.snake.ai.performance

object TimingUtils {
    fun execTime(fn: () -> Unit): Double {
        val start = System.nanoTime()
        fn()
        val end = System.nanoTime()
        val elapsed = end - start
        return elapsed / 1e9
    }
}