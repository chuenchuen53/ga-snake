package com.example.snake.game

import com.example.snake.game.typing.Direction
import com.example.snake.game.typing.NotNullPositionAndDirection
import com.example.snake.game.typing.PositionAndDirection
import com.example.snake.game.typing.SnakeAction

class Snake(
    positions: MutableList<Position>,
    var direction: Direction,
    val allPositions2D: List<List<Position>>
) {
    companion object {
        fun actionMap(direction: Direction, snakeAction: SnakeAction): DirectionAndDxDy = when (direction) {
            Direction.UP -> when (snakeAction) {
                SnakeAction.FRONT -> DirectionAndDxDy.UP
                SnakeAction.TURN_LEFT -> DirectionAndDxDy.LEFT
                SnakeAction.TURN_RIGHT -> DirectionAndDxDy.RIGHT
            }

            Direction.DOWN -> when (snakeAction) {
                SnakeAction.FRONT -> DirectionAndDxDy.DOWN
                SnakeAction.TURN_LEFT -> DirectionAndDxDy.RIGHT
                SnakeAction.TURN_RIGHT -> DirectionAndDxDy.LEFT
            }

            Direction.LEFT -> when (snakeAction) {
                SnakeAction.FRONT -> DirectionAndDxDy.LEFT
                SnakeAction.TURN_LEFT -> DirectionAndDxDy.DOWN
                SnakeAction.TURN_RIGHT -> DirectionAndDxDy.UP
            }

            Direction.RIGHT -> when (snakeAction) {
                SnakeAction.FRONT -> DirectionAndDxDy.RIGHT
                SnakeAction.TURN_LEFT -> DirectionAndDxDy.UP
                SnakeAction.TURN_RIGHT -> DirectionAndDxDy.DOWN
            }
        }

        fun directionDxDyMap(direction: Direction): DxDy = when (direction) {
            Direction.UP -> DxDy.UP
            Direction.DOWN -> DxDy.DOWN
            Direction.LEFT -> DxDy.LEFT
            Direction.RIGHT -> DxDy.RIGHT
        }
    }

    val positions = ArrayDeque(positions)
    val positionsSet = positions.toMutableSet()
    val head: Position
        get() = positions[0]
    val length: Int
        get() = positions.size


    fun positionIsInSnake(position: Position): Boolean = positionsSet.contains(position)

    fun toPlainObject(): SnakeData = SnakeData(positions, direction, allPositions2D)

    fun toPlainObjectWithoutAllPositions2D(): SnakeData = SnakeData(positions, direction, emptyList())

    /**
     * Checks if the snake will eat itself after moving to a new position.
     *
     * @param position The new position of the head (assumes this position is not the food position).
     * @return True if the new position is occupied by the snake, false otherwise.
     */
    fun checkEatSelfAfterMove(position: Position): Boolean {
        // Ignore the tail as it will move
        val lastIndex = this.positions.size - 1
        return if (this.positions[lastIndex] == position) false else positionIsInSnake(position)
    }

    fun getHeadPositionAndDirectionAfterMoveBySnakeAction(action: SnakeAction): PositionAndDirection {
        val (x0, y0) = head
        val (direction, positionChange) = actionMap(direction, action)
        val (dx, dy) = positionChange
        val position: Position? = allPositions2D.getOrNull(y0 + dy)?.getOrNull(x0 + dx)
        return PositionAndDirection(position, direction)
    }

    fun getHeadPositionAndDirectionAfterMoveByDirection(direction: Direction): PositionAndDirection {
        val (x0, y0) = head
        val (dx, dy) = directionDxDyMap(direction)
        val position: Position? = allPositions2D.getOrNull(y0 + dy)?.getOrNull(x0 + dx)
        return PositionAndDirection(position, direction)
    }

    fun move(direction: Direction) {
        val positionAndDirection =
            getHeadPositionAndDirectionAfterMoveByDirectionWithCheckingEatSelfAndOutOfBound(direction)

        positionsSet.remove(positions.last())
        positionsSet.add(positionAndDirection.position)

        positions.addFirst(positionAndDirection.position)
        positions.removeLast()

        this.direction = positionAndDirection.direction
    }

    fun moveWithFoodEaten(direction: Direction) {
        val positionAndDirection =
            getHeadPositionAndDirectionAfterMoveByDirectionWithCheckingEatSelfAndOutOfBound(direction)
        positionsSet.add(positionAndDirection.position)
        positions.addFirst(positionAndDirection.position)
        this.direction = positionAndDirection.direction
    }

    private fun getHeadPositionAndDirectionAfterMoveByDirectionWithCheckingEatSelfAndOutOfBound(direction: Direction): NotNullPositionAndDirection {
        if (this.direction == direction.opposite) throw IllegalArgumentException("Snake cannot move to opposite direction")
        val positionAndDirection = getHeadPositionAndDirectionAfterMoveByDirection(direction)
        positionAndDirection.position ?: throw IllegalArgumentException("Snake move will be out of bounds")
        return NotNullPositionAndDirection(positionAndDirection.position, positionAndDirection.direction)
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Snake

        if (direction != other.direction) return false
        if (allPositions2D != other.allPositions2D) return false
        if (positions != other.positions) return false

        return true
    }

    override fun hashCode(): Int {
        var result = direction.hashCode()
        result = 31 * result + allPositions2D.hashCode()
        result = 31 * result + positions.hashCode()
        return result
    }
}

data class DxDy(val dx: Int, val dy: Int) {
    companion object {
        val UP = DxDy(0, -1)
        val DOWN = DxDy(0, 1)
        val LEFT = DxDy(-1, 0)
        val RIGHT = DxDy(1, 0)
    }
}

data class DirectionAndDxDy(val direction: Direction, val dxDy: DxDy) {
    companion object {
        val UP = DirectionAndDxDy(Direction.UP, DxDy.UP)
        val DOWN = DirectionAndDxDy(Direction.DOWN, DxDy.DOWN)
        val LEFT = DirectionAndDxDy(Direction.LEFT, DxDy.LEFT)
        val RIGHT = DirectionAndDxDy(Direction.RIGHT, DxDy.RIGHT)
    }
}

data class SnakeData(
    val positions: List<Position>,
    val direction: Direction,
    val allPositions2D: List<List<Position>>
)