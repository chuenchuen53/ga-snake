package com.example.snake.ai.multithread

import com.example.snake.game.GameRecord

data class WorkerResult(
    val snakeLengthArr: IntArray,
    val moveArr: IntArray,
    val gameRecordArr: Array<GameRecord>,
)