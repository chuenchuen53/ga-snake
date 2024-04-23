package com.example.snake.game

import com.example.snake.game.typing.Direction
import com.example.snake.game.typing.PositionAndDirection
import com.example.snake.game.typing.SnakeAction

class SnakeGame(options: Options) {
    companion object {
        fun clone(snakeGame: SnakeGame): SnakeGame = SnakeGame(
            Options(
                snakeGame.worldWidth,
                snakeGame.worldHeight,
                ProvidedInitialStatus(
                    snakeGame.snake.toPlainObject(),
                    snakeGame.food,
                    snakeGame.gameOver,
                    snakeGame.moves,
                    snakeGame.movesForNoFood,
                    snakeGame.initialSnakePosition,
                    snakeGame.initialSnakeDirection,
                    snakeGame.initialFoodPosition,
                    snakeGame.moveRecord.toList()
                )
            )
        )

        fun cloneGameRecord(gameRecord: GameRecord): GameRecord = GameRecord(
            gameRecord.worldWidth,
            gameRecord.worldHeight,
            gameRecord.initialSnakePosition,
            gameRecord.initialSnakeDirection,
            gameRecord.initialFoodPosition,
            gameRecord.moveRecord.toList()
        )
    }

    var worldWidth: Int = options.worldWidth
    var worldHeight: Int = options.worldHeight
    var allPositions: List<Position>
    var allPositions2D: List<List<Position>>
    var snake: Snake
    var food: Position
    var gameOver: Boolean
    var moves: Int
    var movesForNoFood: Int
    var maxMovesOfNoFood: Int
    var initialSnakePosition: Position
    var initialSnakeDirection: Direction
    var initialFoodPosition: Position
    var moveRecord: MutableList<Int> = mutableListOf()
    var resetCount = 0

    init {
        allPositions2D = List(worldHeight) { y -> List(worldWidth) { x -> Position(x, y) } }
        allPositions = allPositions2D.flatten()

        val providedInitialStatus = options.providedInitialStatus
        if (providedInitialStatus != null) {
            snake = getInitSnakeWithProvidedPositionAndDirection(
                providedInitialStatus.snake.positions,
                providedInitialStatus.snake.direction
            )
            food = allPositions.find { it == providedInitialStatus.food }
                ?: throw IllegalArgumentException("Provided food position is not valid")
            gameOver = providedInitialStatus.gameOver
            moves = providedInitialStatus.moves
            movesForNoFood = providedInitialStatus.movesForNoFood
            maxMovesOfNoFood = 0
            initialSnakePosition = allPositions.find { it == providedInitialStatus.initialSnakePosition }
                ?: throw IllegalArgumentException("Provided initial snake position is not valid")
            initialSnakeDirection = providedInitialStatus.initialSnakeDirection
            initialFoodPosition =
                allPositions.find { it == providedInitialStatus.initialFoodPosition } ?: throw IllegalArgumentException(
                    "Provided initial food position is not valid"
                )
            moveRecord = providedInitialStatus.moveRecord.toMutableList()
        } else {
            snake = getInitSnake()
            food = getRandomFoodPosition()
            gameOver = false
            moves = 0
            movesForNoFood = 0
            maxMovesOfNoFood = 0
            initialSnakePosition = snake.head
            initialSnakeDirection = snake.direction
            initialFoodPosition = food
            moveRecord = mutableListOf()
        }

        updateMaxTurnOfNoFood()
    }

    fun toPlainObject(): SnakeGameData = SnakeGameData(
        worldWidth = worldWidth,
        worldHeight = worldHeight,
        allPositions = allPositions,
        allPositions2D = allPositions2D,
        snake = snake.toPlainObject(),
        food = food,
        gameOver = gameOver,
        moves = moves,
        movesForNoFood = movesForNoFood,
        maxMovesOfNoFood = maxMovesOfNoFood,
        initialSnakePosition = initialSnakePosition,
        initialSnakeDirection = initialSnakeDirection,
        initialFoodPosition = initialFoodPosition,
        moveRecord = moveRecord.toList()
    )

    fun toPlainObjectIgnoreMoveRecordAndAllPosition(): SnakeGameData = SnakeGameData(
        worldWidth = worldWidth,
        worldHeight = worldHeight,
        allPositions = emptyList(),
        allPositions2D = emptyList(),
        snake = snake.toPlainObjectWithoutAllPositions2D(),
        food = food,
        gameOver = gameOver,
        moves = moves,
        movesForNoFood = movesForNoFood,
        maxMovesOfNoFood = maxMovesOfNoFood,
        initialSnakePosition = initialSnakePosition,
        initialSnakeDirection = initialSnakeDirection,
        initialFoodPosition = initialFoodPosition,
        moveRecord = emptyList()
    )

    fun exportGameRecord(): GameRecord = GameRecord(
        worldWidth = worldWidth,
        worldHeight = worldHeight,
        initialSnakePosition = initialSnakePosition,
        initialSnakeDirection = initialSnakeDirection,
        initialFoodPosition = initialFoodPosition,
        moveRecord = moveRecord.toList()
    )

    fun indexInAllPositions(x: Int, y: Int): Int = x + worldWidth * y

    fun encodeMoveRecord(direction: Direction, newFoodPos: Position? = null): Int {
        val encodedDirection = direction.value

        newFoodPos?.let {
            val newFoodPosIn1D = indexInAllPositions(it.x, it.y)
            // add 1 to avoid 0
            return 10 * (newFoodPosIn1D + 1) + encodedDirection
        }

        return encodedDirection
    }

    fun reset() {
        snake = getInitSnake()
        food = getRandomFoodPosition()
        gameOver = false
        moves = 0
        movesForNoFood = 0
        maxMovesOfNoFood = 0
        initialSnakePosition = snake.head
        initialSnakeDirection = snake.direction
        initialFoodPosition = food
        moveRecord = mutableListOf()
        updateMaxTurnOfNoFood()
        resetCount++
    }

    fun suicide(direction: Direction) {
        if (gameOver) throw IllegalStateException("suicide method is called when game is over")

        moves++
        movesForNoFood++
        gameOver = true
        val encodedMove = encodeMoveRecord(direction)
        moveRecord.add(encodedMove)
    }

    fun checkOutOfBounds(position: Position): Boolean {
        return position.x < 0 || position.x >= worldWidth || position.y < 0 || position.y >= worldHeight
    }

    fun getRandomFoodPosition(): Position {
        val snakePositions = snake.positionsSet
        val availablePositions = allPositions.filter { it !in snakePositions }

        return availablePositions.random()
    }

    fun snakeMoveBySnakeAction(action: SnakeAction) {
        if (gameOver) throw IllegalStateException("snakeMoveBySnakeAction() is called when game is over")

        val newHeadPositionAndDirection = snake.getHeadPositionAndDirectionAfterMoveBySnakeAction(action)
        snakeMove(newHeadPositionAndDirection)
    }

    fun snakeMoveByDirection(direction: Direction) {
        if (gameOver) throw IllegalStateException("snakeMoveByDirection() is called when game is over")

        if (snake.direction == direction.opposite) {
            suicide(direction)
            return
        }

        val newHeadPositionAndDirection = snake.getHeadPositionAndDirectionAfterMoveByDirection(direction)
        snakeMove(newHeadPositionAndDirection)
    }

    fun snakeMove(newHeadPositionAndDirection: PositionAndDirection, providedFoodPosition: Position? = null) {
        val newHeadPosition = newHeadPositionAndDirection.position
        val newHeadDirection = newHeadPositionAndDirection.direction

        newHeadPosition ?: run {
            // out of bound
            suicide(newHeadDirection)
            return
        }

        moves++
        val eatFood = food == newHeadPosition
        if (eatFood) {
            snake.moveWithFoodEaten(newHeadDirection)
            movesForNoFood = 0

            if (snake.length >= worldWidth * worldHeight) {
                gameOver = true
            } else {
                food = providedFoodPosition ?: getRandomFoodPosition()
                updateMaxTurnOfNoFood()
            }
        } else {
            movesForNoFood++
            if (snake.checkEatSelfAfterMove(newHeadPosition)) {
                gameOver = true
            } else {
                snake.move(newHeadDirection)
                if (movesForNoFood >= maxMovesOfNoFood) gameOver = true
            }
        }

        val encodedMove = encodeMoveRecord(newHeadDirection, if (eatFood) food else null)
        moveRecord.add(encodedMove)
    }


    private fun updateMaxTurnOfNoFood() {
        val snakeLength = snake.length
        val size = worldWidth * worldHeight
        maxMovesOfNoFood = when {
            snakeLength < 0.2 * size -> size / 2
            snakeLength < 0.5 * size -> size
            else -> 2 * size
        }
    }

    private fun getInitSnake(): Snake {
        val position = allPositions2D[worldHeight / 2][worldWidth / 2]
        val direction = Direction.entries.toTypedArray().random()
        return Snake(mutableListOf(position), direction, allPositions2D)
    }

    private fun getInitSnakeWithProvidedPositionAndDirection(
        positionsPlainObject: List<Position>,
        direction: Direction
    ): Snake {
        val positions = positionsPlainObject.mapNotNull { p -> allPositions.find { p2 -> p2 == p } }.toMutableList()
        if (positions.size != positionsPlainObject.size) throw IllegalArgumentException("Provided snake position is not valid")
        return Snake(positions, direction, allPositions2D)
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as SnakeGame

        if (worldWidth != other.worldWidth) return false
        if (worldHeight != other.worldHeight) return false
        if (allPositions != other.allPositions) return false
        if (allPositions2D != other.allPositions2D) return false
        if (snake != other.snake) return false
        if (food != other.food) return false
        if (gameOver != other.gameOver) return false
        if (moves != other.moves) return false
        if (movesForNoFood != other.movesForNoFood) return false
        if (maxMovesOfNoFood != other.maxMovesOfNoFood) return false
        if (initialSnakePosition != other.initialSnakePosition) return false
        if (initialSnakeDirection != other.initialSnakeDirection) return false
        if (initialFoodPosition != other.initialFoodPosition) return false
        if (moveRecord != other.moveRecord) return false

        return true
    }

    override fun hashCode(): Int {
        var result = worldWidth
        result = 31 * result + worldHeight
        result = 31 * result + allPositions.hashCode()
        result = 31 * result + allPositions2D.hashCode()
        result = 31 * result + snake.hashCode()
        result = 31 * result + food.hashCode()
        result = 31 * result + gameOver.hashCode()
        result = 31 * result + moves
        result = 31 * result + movesForNoFood
        result = 31 * result + maxMovesOfNoFood
        result = 31 * result + initialSnakePosition.hashCode()
        result = 31 * result + initialSnakeDirection.hashCode()
        result = 31 * result + initialFoodPosition.hashCode()
        result = 31 * result + moveRecord.hashCode()
        return result
    }
}

data class GameRecord(
    val worldWidth: Int,
    val worldHeight: Int,
    val initialSnakePosition: Position,
    val initialSnakeDirection: Direction,
    val initialFoodPosition: Position,
    /**
     * 0 -> up, 1 -> down, 2 -> left, 3 -> right
     * if no eat food, the snake will be direction
     * if eat food, the snake will be ( new food index in 1d + 1 ) * 10 + direction
     * */
    val moveRecord: List<Int>,
)

data class ProvidedInitialStatus(
    val snake: SnakeData,
    val food: Position,
    val gameOver: Boolean,
    val moves: Int,
    val movesForNoFood: Int,
    val initialSnakePosition: Position,
    val initialSnakeDirection: Direction,
    val initialFoodPosition: Position,
    val moveRecord: List<Int>
)

data class Options(
    val worldWidth: Int,
    val worldHeight: Int,
    val providedInitialStatus: ProvidedInitialStatus?
)

data class SnakeGameData(
    val worldWidth: Int,
    val worldHeight: Int,
    val allPositions: List<Position>,
    val allPositions2D: List<List<Position>>,
    val snake: SnakeData,
    val food: Position,
    val gameOver: Boolean,
    val moves: Int,
    val movesForNoFood: Int,
    val maxMovesOfNoFood: Int,
    val initialSnakePosition: Position,
    val initialSnakeDirection: Direction,
    val initialFoodPosition: Position,
    val moveRecord: List<Int>
)

