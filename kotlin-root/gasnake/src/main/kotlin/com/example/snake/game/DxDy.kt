package com.example.snake.game

data class DxDy(val dx: Int, val dy: Int) {
    companion object {
        val UP = DxDy(0, -1)
        val DOWN = DxDy(0, 1)
        val LEFT = DxDy(-1, 0)
        val RIGHT = DxDy(1, 0)
    }
}