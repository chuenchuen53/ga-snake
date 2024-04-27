package com.example.snake.ai.multithread

import com.example.snake.game.GameRecord

data class WorkerResult(
    val snakeLengthArr: IntArray,
    val moveArr: IntArray,
    val gameRecordArr: Array<GameRecord>,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as WorkerResult

        if (!snakeLengthArr.contentEquals(other.snakeLengthArr)) return false
        if (!moveArr.contentEquals(other.moveArr)) return false
        if (!gameRecordArr.contentEquals(other.gameRecordArr)) return false

        return true
    }

    override fun hashCode(): Int {
        var result = snakeLengthArr.contentHashCode()
        result = 31 * result + moveArr.contentHashCode()
        result = 31 * result + gameRecordArr.contentHashCode()
        return result
    }
}