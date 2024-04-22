package com.example.snake.ai

import com.example.snake.game.Position
import com.example.snake.game.SnakeGame
import com.example.snake.game.typing.Direction

data class RelativePosition(val dx: Int, val dy: Int) {
    companion object {
        val UP = RelativePosition(0, -1)
        val DOWN = RelativePosition(0, 1)
        val LEFT = RelativePosition(-1, 0)
        val RIGHT = RelativePosition(1, 0)

        val slopeMap4 = listOf(DOWN, RIGHT, UP, LEFT)
    }
}

class InputLayer(val game: SnakeGame) {
    companion object {
        // total length is 25
        // 0-3: is food in slope map position relative to snake head
        // 4-7: is snake slope map position relative to snake head
        // 8-11: is out of bound in slope map position relative to snake head
        // 12-15: is direction of snake head
        // 16-19 is food-snake distance
        // 20-23 is snake portion
        // 24 is snakeLength/(worldWidth*worldHeight)
        // slopeMap4.length * 3 + 4 + 4 + 4 + 1
        const val inputLayerLength = 25

        val currentDirectionUp = doubleArrayOf(1.0, 0.0, 0.0, 0.0)
        val currentDirectionDown = doubleArrayOf(0.0, 1.0, 0.0, 0.0)
        val currentDirectionLeft = doubleArrayOf(0.0, 0.0, 1.0, 0.0)
        val currentDirectionRight = doubleArrayOf(0.0, 0.0, 0.0, 1.0)
    }

    val numOfBoardCell = game.worldWidth * game.worldHeight
    val template = DoubleArray(inputLayerLength)

    fun compute(): DoubleArray {
        val result = template.clone()

        val foodSnakeOutOfBound = foodSnakeOutOfBoundValue(RelativePosition.slopeMap4)
        val foodSnakeOutOfBoundStartIndex = 0
        foodSnakeOutOfBound.forEachIndexed { index, v -> result[foodSnakeOutOfBoundStartIndex + index] = v }

        val directionValue = currentDirectionValue()
        val directionStartIndex = RelativePosition.slopeMap4.size * 3
        directionValue.forEachIndexed { index, v -> result[directionStartIndex + index] = v }

        val foodDistance = foodDistanceValue()
        val foodDistanceStartIndex = directionStartIndex + directionValue.size
        foodDistance.forEachIndexed { index, v -> result[foodDistanceStartIndex + index] = v }

        val snakePortion = snakePortionValue()
        val snakePortionStartIndex = foodDistanceStartIndex + foodDistance.size
        snakePortion.forEachIndexed { index, v -> result[snakePortionStartIndex + index] = v }

        val snakeLengthWorldRatio = getSnakeLengthWorldRatio()
        val snakeLengthWorldRatioIndex = snakePortionStartIndex + snakePortion.size
        result[snakeLengthWorldRatioIndex] = snakeLengthWorldRatio

        return result
    }

    fun foodSnakeOutOfBoundValue(relativePositions: List<RelativePosition>): DoubleArray {
        val result = DoubleArray(relativePositions.size * 3)
        val snakeHead = game.snake.head

        val foodStartIndex = 0
        val snakeStartIndex = relativePositions.size
        val outOfBoundStartIndex = relativePositions.size * 2

        relativePositions.forEachIndexed { index, s ->
            val pos = Position(snakeHead.x + s.dx, snakeHead.y + s.dy)
            result[foodStartIndex + index] = if (game.food == pos) 1.0 else 0.0
            result[snakeStartIndex + index] = if (game.snake.positionIsInSnake(pos)) 1.0 else 0.0
            result[outOfBoundStartIndex + index] = if (game.checkOutOfBounds(pos)) 1.0 else 0.0
        }
        return result
    }

    fun currentDirectionValue(): DoubleArray = when (game.snake.direction) {
        Direction.UP -> currentDirectionUp
        Direction.DOWN -> currentDirectionDown
        Direction.LEFT -> currentDirectionLeft
        Direction.RIGHT -> currentDirectionRight
    }

    fun foodDistanceValue(): DoubleArray {
        val food = game.food
        val snakeHead = game.snake.head

        val top = (if (food.y < snakeHead.y) (1.0 / (snakeHead.y - food.y)) else 0).toDouble()
        val bottom = (if (food.y > snakeHead.y) (1.0 / (food.y - snakeHead.y)) else 0).toDouble()
        val left = (if (food.x < snakeHead.x) (1.0 / (snakeHead.x - food.x)) else 0).toDouble()
        val right = (if (food.x > snakeHead.x) (1.0 / (food.x - snakeHead.x)) else 0).toDouble()

        return doubleArrayOf(top, bottom, left, right)
    }

    fun snakePortionValue(): DoubleArray {
        val (snakeHeadX, snakeHeadY) = game.snake.head

        var topCount = 0
        var bottomCount = 0
        var leftCount = 0
        var rightCount = 0

        for (pos in game.snake.positions) {
            if (pos.y < snakeHeadY) {
                topCount++
            } else if (pos.y > snakeHeadY) {
                bottomCount++
            }

            if (pos.x < snakeHeadX) {
                leftCount++
            } else if (pos.x > snakeHeadX) {
                rightCount++
            }
        }

        val topResult = topCount.toDouble() / numOfBoardCell
        val bottomResult = bottomCount.toDouble() / numOfBoardCell
        val leftResult = leftCount.toDouble() / numOfBoardCell
        val rightResult = rightCount.toDouble() / numOfBoardCell

        return doubleArrayOf(topResult, bottomResult, leftResult, rightResult)
    }

    fun getSnakeLengthWorldRatio(): Double {
        return game.snake.length.toDouble() / (game.worldWidth * game.worldHeight)
    }
}