package com.example.snake.game

class SnakeGame(options: Options) {
    companion object {
        fun cloneGameRecord(gameRecord: GameRecord): GameRecord = GameRecord(
            gameRecord.worldWidth,
            gameRecord.worldHeight,
            gameRecord.initialSnakePosition,
            gameRecord.initialSnakeDirection,
            gameRecord.initialFoodPosition,
            gameRecord.moveRecord.toList()
        )
    }

    val worldWidth: Int = options.worldWidth
    val worldHeight: Int = options.worldHeight
    val allPositions: List<Position>
    val allPositions2D: List<List<Position>> = List(worldHeight) { y -> List(worldWidth) { x -> Position(x, y) } }
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

    private val maxSnakeLength = worldWidth * worldHeight

    init {
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

    private fun encodeMoveRecord(direction: Direction, newFoodPos: Position? = null): Int {
        val encodedDirection = direction.value

        newFoodPos?.let {
            val newFoodPosIn1D = indexInAllPositions(it.x, it.y)
            // add 1 to avoid 0
            return 10 * (newFoodPosIn1D + 1) + encodedDirection
        }

        return encodedDirection
    }

    private fun updateMaxTurnOfNoFood() {
        val snakeLength = snake.length
        maxMovesOfNoFood = when {
            snakeLength < 0.2 * maxSnakeLength -> maxSnakeLength / 2
            snakeLength < 0.5 * maxSnakeLength -> maxSnakeLength
            else -> 2 * maxSnakeLength
        }
    }

    private fun getInitSnake(): Snake {
        val position = allPositions2D[worldHeight / 2][worldWidth / 2]
        val direction = Direction.entries.random()
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

