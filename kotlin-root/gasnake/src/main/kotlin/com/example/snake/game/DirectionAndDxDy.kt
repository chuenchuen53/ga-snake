package com.example.snake.game

data class DirectionAndDxDy(val direction: Direction, val dxDy: DxDy) {
    companion object {
        val UP = DirectionAndDxDy(Direction.UP, DxDy.UP)
        val DOWN = DirectionAndDxDy(Direction.DOWN, DxDy.DOWN)
        val LEFT = DirectionAndDxDy(Direction.LEFT, DxDy.LEFT)
        val RIGHT = DirectionAndDxDy(Direction.RIGHT, DxDy.RIGHT)
    }
}
