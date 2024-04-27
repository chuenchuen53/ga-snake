package snake.game

import com.example.snake.game.*
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.Arguments
import org.junit.jupiter.params.provider.MethodSource
import org.mockito.Mockito.*
import org.mockito.kotlin.anyOrNull
import java.util.stream.Stream
import kotlin.test.Test

fun snakeGameFactory() = SnakeGame(
    Options(
        worldWidth = 5,
        worldHeight = 5,
        providedInitialStatus = ProvidedInitialStatus(
            snake = SnakeData(
                positions = mutableListOf(Position(2, 2)),
                direction = Direction.UP,
                allPositions2D = emptyList()
            ),
            food = Position(0, 0),
            moves = 0,
            movesForNoFood = 0,
            gameOver = false,
            initialSnakePosition = Position(1, 1),
            initialSnakeDirection = Direction.UP,
            initialFoodPosition = Position(0, 0),
            moveRecord = mutableListOf()
        )
    )
)

class SnakeGameTest {

    companion object {
        @JvmStatic
        val allPositionsFor3x2World = listOf(
            Position(0, 0), Position(1, 0), Position(2, 0), Position(0, 1), Position(1, 1), Position(2, 1)
        )

        @JvmStatic
        val allPositions2DFor3x2World = listOf(
            listOf(Position(0, 0), Position(1, 0), Position(2, 0)),
            listOf(Position(0, 1), Position(1, 1), Position(2, 1))
        )

        @JvmStatic
        val allPositionsFor3x3World = listOf(
            Position(0, 0), Position(1, 0), Position(2, 0),
            Position(0, 1), Position(1, 1), Position(2, 1),
            Position(0, 2), Position(1, 2), Position(2, 2)
        )

        @JvmStatic
        val allPositions2DFor3x3World = listOf(
            listOf(Position(0, 0), Position(1, 0), Position(2, 0)),
            listOf(Position(0, 1), Position(1, 1), Position(2, 1)),
            listOf(Position(0, 2), Position(1, 2), Position(2, 2))
        )

        @JvmStatic
        fun checkOutOfBoundsTestData(): Stream<Arguments> {
            val snakeGame1 = SnakeGame(Options(3, 3, null))
            val snakeGame2 = SnakeGame(Options(5, 4, null))

            return Stream.of(
                Arguments.of(snakeGame1, -1, 0, true),
                Arguments.of(snakeGame1, -1, -1, true),
                Arguments.of(snakeGame1, 0, -1, true),
                Arguments.of(snakeGame1, 3, 0, true),
                Arguments.of(snakeGame1, 3, 3, true),
                Arguments.of(snakeGame1, 0, 3, true),
                Arguments.of(snakeGame1, 0, 0, false),
                Arguments.of(snakeGame1, 0, 1, false),
                Arguments.of(snakeGame1, 0, 2, false),
                Arguments.of(snakeGame1, 1, 0, false),
                Arguments.of(snakeGame1, 1, 1, false),
                Arguments.of(snakeGame1, 1, 2, false),
                Arguments.of(snakeGame1, 2, 0, false),
                Arguments.of(snakeGame1, 2, 1, false),
                Arguments.of(snakeGame1, 2, 2, false),
                Arguments.of(snakeGame2, -1, 0, true),
                Arguments.of(snakeGame2, -1, -1, true),
                Arguments.of(snakeGame2, 0, -1, true),
                Arguments.of(snakeGame2, 5, 0, true),
                Arguments.of(snakeGame2, 5, 4, true),
                Arguments.of(snakeGame2, 0, 4, true),
                Arguments.of(snakeGame2, 0, 0, false),
                Arguments.of(snakeGame2, 0, 1, false),
                Arguments.of(snakeGame2, 0, 2, false),
                Arguments.of(snakeGame2, 0, 3, false),
                Arguments.of(snakeGame2, 1, 0, false),
                Arguments.of(snakeGame2, 1, 1, false),
                Arguments.of(snakeGame2, 1, 2, false),
                Arguments.of(snakeGame2, 1, 3, false),
                Arguments.of(snakeGame2, 2, 0, false),
                Arguments.of(snakeGame2, 2, 1, false),
                Arguments.of(snakeGame2, 2, 2, false),
                Arguments.of(snakeGame2, 2, 3, false),
                Arguments.of(snakeGame2, 3, 0, false),
                Arguments.of(snakeGame2, 3, 1, false),
                Arguments.of(snakeGame2, 3, 2, false),
                Arguments.of(snakeGame2, 3, 3, false),
                Arguments.of(snakeGame2, 4, 0, false),
                Arguments.of(snakeGame2, 4, 1, false),
                Arguments.of(snakeGame2, 4, 2, false),
                Arguments.of(snakeGame2, 4, 3, false)
            )
        }

        @JvmStatic
        fun getRandomFoodPositionTestData(): Stream<Arguments> {
            val snakeGame1 = SnakeGame(Options(2, 2, null))

            val snakeGame2 = SnakeGame(Options(
                worldWidth = 2,
                worldHeight = 2,
                providedInitialStatus = ProvidedInitialStatus(
                    snake = SnakeData(listOf(Position(0, 1), Position(1, 1)), Direction.LEFT, emptyList()),
                    food = Position(0, 0),
                    moves = 10,
                    movesForNoFood = 2,
                    gameOver = false,
                    initialSnakePosition = Position(1, 1),
                    initialSnakeDirection = Direction.UP,
                    initialFoodPosition = Position(0, 0),
                    moveRecord = List(10) { 0 }
                )
            ))

            val snakeGame3 = SnakeGame(Options(worldWidth = 2, worldHeight = 4, providedInitialStatus = null))

            val snakeGame4 = SnakeGame(Options(
                worldWidth = 3,
                worldHeight = 2,
                providedInitialStatus = ProvidedInitialStatus(
                    snake = SnakeData(
                        listOf(Position(0, 1), Position(1, 1), Position(1, 0)),
                        Direction.LEFT,
                        emptyList()
                    ),
                    food = Position(0, 0),
                    moves = 10,
                    movesForNoFood = 3,
                    gameOver = false,
                    initialSnakePosition = Position(1, 1),
                    initialSnakeDirection = Direction.UP,
                    initialFoodPosition = Position(0, 0),
                    moveRecord = List(10) { 0 }
                )
            ))

            return Stream.of(
                Arguments.of("test 1", snakeGame1),
                Arguments.of("test 2", snakeGame2),
                Arguments.of("test 3", snakeGame3),
                Arguments.of("test 4", snakeGame4)
            )
        }

        @JvmStatic
        fun indexInAllPositionsTestData(): Stream<Arguments> {
            val snakeGame1 = SnakeGame(Options(3, 3, null))
            val snakeGame2 = SnakeGame(Options(3, 2, null))

            return Stream.of(
                Arguments.of("test 1", snakeGame1),
                Arguments.of("test 2", snakeGame2)
            )
        }
    }
    
    @Test
    fun `static cloneGameRecord test`() {
        val gameRecord = GameRecord(
            worldWidth = 10,
            worldHeight = 8,
            initialSnakePosition = Position(3, 4),
            initialSnakeDirection = Direction.UP,
            initialFoodPosition = Position(0, 0),
            moveRecord = listOf(0, 2, 3, -1)
        )

        val clone = SnakeGame.cloneGameRecord(gameRecord)

        Assertions.assertEquals(gameRecord, clone)
        Assertions.assertNotSame(gameRecord, clone)
    }

    @Test
    fun `constructor test 3x3 world`() {
        val snakeGame = SnakeGame(Options(worldWidth = 3, worldHeight = 3, providedInitialStatus = null))

        Assertions.assertEquals(3, snakeGame.worldWidth)
        Assertions.assertEquals(3, snakeGame.worldHeight)
        Assertions.assertEquals(allPositionsFor3x3World, snakeGame.allPositions)
        Assertions.assertEquals(allPositions2DFor3x3World, snakeGame.allPositions2D)
        Assertions.assertEquals(1, snakeGame.snake.length)
        Assertions.assertTrue(snakeGame.snake.head == Position(1, 1))
        Assertions.assertFalse(snakeGame.food == Position(1, 1))
        Assertions.assertFalse(snakeGame.gameOver)
        Assertions.assertEquals(0, snakeGame.moves)
        Assertions.assertEquals(0, snakeGame.movesForNoFood)
        Assertions.assertTrue(snakeGame.maxMovesOfNoFood > 0)
    }

    @Test
    fun `constructor test for providedInitialStatus 3x3 world`() {
        val snakePositions = listOf(
            Position(1, 1),
            Position(2, 1),
            Position(2, 2),
            Position(1, 2)
        )

        val snakeGame = SnakeGame(Options(
            worldWidth = 3,
            worldHeight = 3,
            providedInitialStatus = ProvidedInitialStatus(
                snake = SnakeData(snakePositions, Direction.LEFT, emptyList()),
                food = Position(0, 0),
                moves = 10,
                movesForNoFood = 2,
                gameOver = false,
                initialSnakePosition = Position(1, 1),
                initialSnakeDirection = Direction.UP,
                initialFoodPosition = Position(0, 0),
                moveRecord = List(10) { 0 }
            )
        ))

        Assertions.assertEquals(3, snakeGame.worldWidth)
        Assertions.assertEquals(3, snakeGame.worldHeight)
        Assertions.assertEquals(allPositionsFor3x3World, snakeGame.allPositions)
        Assertions.assertEquals(allPositions2DFor3x3World, snakeGame.allPositions2D)
        Assertions.assertEquals(4, snakeGame.snake.positions.size)
        Assertions.assertEquals(snakePositions, snakeGame.snake.positions)
        Assertions.assertTrue(snakeGame.food == Position(0, 0))
        Assertions.assertFalse(snakeGame.gameOver)
        Assertions.assertEquals(10, snakeGame.moves)
        Assertions.assertEquals(2, snakeGame.movesForNoFood)
        Assertions.assertTrue(snakeGame.maxMovesOfNoFood > 0)
    }

    @Test
    fun `constructor test 3x2 world`() {
        val snakeGame = SnakeGame(Options(worldWidth = 3, worldHeight = 2, providedInitialStatus = null))

        Assertions.assertEquals(3, snakeGame.worldWidth)
        Assertions.assertEquals(2, snakeGame.worldHeight)
        Assertions.assertEquals(allPositionsFor3x2World, snakeGame.allPositions)
        Assertions.assertEquals(allPositions2DFor3x2World, snakeGame.allPositions2D)
        Assertions.assertEquals(1, snakeGame.snake.length)
        Assertions.assertTrue(snakeGame.snake.head == Position(1, 1))
        Assertions.assertFalse(snakeGame.food == Position(1, 1))
        Assertions.assertFalse(snakeGame.gameOver)
        Assertions.assertEquals(0, snakeGame.moves)
        Assertions.assertEquals(0, snakeGame.movesForNoFood)
        Assertions.assertTrue(snakeGame.maxMovesOfNoFood > 0)
    }

    @Test
    fun `constructor test for providedInitialStatus 3x2 world`() {
        val snakePositions = listOf(
            Position(1, 1),
            Position(2, 1)
        )

        val snakeGame = SnakeGame(Options(
            worldWidth = 3,
            worldHeight = 2,
            providedInitialStatus = ProvidedInitialStatus(
                snake = SnakeData(snakePositions, Direction.LEFT, emptyList()),
                food = Position(0, 0),
                moves = 10,
                movesForNoFood = 2,
                gameOver = false,
                initialSnakePosition = Position(1, 1),
                initialSnakeDirection = Direction.UP,
                initialFoodPosition = Position(0, 0),
                moveRecord = List(10) { 0 }
            )
        ))

        Assertions.assertEquals(3, snakeGame.worldWidth)
        Assertions.assertEquals(2, snakeGame.worldHeight)
        Assertions.assertEquals(allPositionsFor3x2World, snakeGame.allPositions)
        Assertions.assertEquals(allPositions2DFor3x2World, snakeGame.allPositions2D)
        Assertions.assertEquals(2, snakeGame.snake.positions.size)
        Assertions.assertEquals(snakePositions, snakeGame.snake.positions)
        Assertions.assertTrue(snakeGame.food == Position(0, 0))
        Assertions.assertFalse(snakeGame.gameOver)
        Assertions.assertEquals(10, snakeGame.moves)
        Assertions.assertEquals(2, snakeGame.movesForNoFood)
        Assertions.assertTrue(snakeGame.maxMovesOfNoFood > 0)
    }

    @Test
    fun `constructor test for invalid snake positions`() {
        val snakePositions = listOf(
            Position(1, 1),
            Position(9, 1)
        )

        val exception = Assertions.assertThrows(IllegalArgumentException::class.java) {
            SnakeGame(Options(
                worldWidth = 3,
                worldHeight = 3,
                providedInitialStatus = ProvidedInitialStatus(
                    snake = SnakeData(snakePositions, Direction.LEFT, emptyList()),
                    food = Position(0, 0),
                    moves = 10,
                    movesForNoFood = 2,
                    gameOver = false,
                    initialSnakePosition = Position(1, 1),
                    initialSnakeDirection = Direction.UP,
                    initialFoodPosition = Position(0, 0),
                    moveRecord = List(10) { 0 }
                )
            ))
        }

        Assertions.assertEquals("Provided snake position is not valid", exception.message)
    }

    @Test
    fun `toPlainObject and toPlainObjectIgnoreMoveRecordAndAllPosition test`() {
        val snakePositions = listOf(
            Position(1, 1),
            Position(2, 1),
            Position(2, 2),
            Position(1, 2)
        )

        val snakeGame = SnakeGame(Options(
            worldWidth = 3,
            worldHeight = 3,
            providedInitialStatus = ProvidedInitialStatus(
                snake = SnakeData(snakePositions, Direction.LEFT, emptyList()),
                food = Position(0, 0),
                moves = 10,
                movesForNoFood = 2,
                gameOver = false,
                initialSnakePosition = Position(1, 1),
                initialSnakeDirection = Direction.UP,
                initialFoodPosition = Position(0, 0),
                moveRecord = List(10) { 0 }
            )
        ))

        val plainObj = snakeGame.toPlainObject()

        val expectedPlainObject = SnakeGameData(
            worldWidth = 3,
            worldHeight = 3,
            allPositions = allPositionsFor3x3World,
            allPositions2D = allPositions2DFor3x3World,
            snake = SnakeData(snakePositions, Direction.LEFT, allPositions2DFor3x3World),
            food = Position(snakeGame.food.x, snakeGame.food.y),
            gameOver = false,
            moves = 10,
            movesForNoFood = 2,
            maxMovesOfNoFood = snakeGame.maxMovesOfNoFood,
            initialSnakePosition = Position(1, 1),
            initialSnakeDirection = Direction.UP,
            initialFoodPosition = Position(0, 0),
            moveRecord = List(10) { 0 }
        )

        Assertions.assertEquals(expectedPlainObject, plainObj)

        val expectedPlainObjectIgnoreMoveRecordAndAllPosition = expectedPlainObject.copy(
            moveRecord = emptyList(),
            allPositions = emptyList(),
            allPositions2D = emptyList(),
            snake = SnakeData(snakePositions, Direction.LEFT, emptyList())
        )

        val plainObjIgnoreMoveRecordAndAllPosition = snakeGame.toPlainObjectIgnoreMoveRecordAndAllPosition()

        Assertions.assertEquals(
            expectedPlainObjectIgnoreMoveRecordAndAllPosition,
            plainObjIgnoreMoveRecordAndAllPosition
        )
    }

    @Test
    fun `exportGameRecord test`() {
        val snakeGame = SnakeGame(Options(10, 10, null))
        snakeGame.snakeMoveBySnakeAction(SnakeAction.TURN_LEFT)
        snakeGame.snakeMoveBySnakeAction(SnakeAction.TURN_LEFT)
        snakeGame.snakeMoveBySnakeAction(SnakeAction.TURN_LEFT)
        snakeGame.snakeMoveBySnakeAction(SnakeAction.TURN_RIGHT)
        snakeGame.snakeMoveBySnakeAction(SnakeAction.TURN_RIGHT)
        snakeGame.snakeMoveBySnakeAction(SnakeAction.TURN_RIGHT)
        snakeGame.snakeMoveBySnakeAction(SnakeAction.FRONT)
        snakeGame.snakeMoveBySnakeAction(SnakeAction.FRONT)
        snakeGame.snakeMoveBySnakeAction(SnakeAction.FRONT)

        val exportGameRecord = snakeGame.exportGameRecord()

        val expectedExportGameRecord = GameRecord(
            worldWidth = 10,
            worldHeight = 10,
            initialSnakePosition = snakeGame.initialSnakePosition,
            initialSnakeDirection = snakeGame.initialSnakeDirection,
            initialFoodPosition = snakeGame.initialFoodPosition,
            moveRecord = snakeGame.moveRecord
        )

        Assertions.assertEquals(expectedExportGameRecord, exportGameRecord)
    }

    @Test
    fun `reset test`() {
        val snakePositions = listOf(
            Position(1, 1),
            Position(2, 1),
            Position(2, 2),
            Position(1, 2)
        )

        val snakeGame = SnakeGame(Options(
            worldWidth = 3,
            worldHeight = 3,
            providedInitialStatus = ProvidedInitialStatus(
                snake = SnakeData(snakePositions, Direction.LEFT, emptyList()),
                food = Position(0, 0),
                moves = 10,
                movesForNoFood = 2,
                gameOver = false,
                initialSnakePosition = Position(1, 1),
                initialSnakeDirection = Direction.UP,
                initialFoodPosition = Position(0, 0),
                moveRecord = List(10) { 0 }
            )
        ))

        snakeGame.reset()

        Assertions.assertEquals(3, snakeGame.worldWidth)
        Assertions.assertEquals(3, snakeGame.worldHeight)
        Assertions.assertEquals(allPositionsFor3x3World, snakeGame.allPositions)
        Assertions.assertEquals(allPositions2DFor3x3World, snakeGame.allPositions2D)
        Assertions.assertEquals(1, snakeGame.snake.positions.size)
        Assertions.assertTrue(snakeGame.snake.head == Position(1, 1))
        Assertions.assertFalse(snakeGame.food == Position(1, 1))
        Assertions.assertFalse(snakeGame.gameOver)
        Assertions.assertEquals(0, snakeGame.moves)
        Assertions.assertEquals(0, snakeGame.movesForNoFood)
        Assertions.assertTrue(snakeGame.maxMovesOfNoFood > 0)
        Assertions.assertEquals(snakeGame.initialSnakePosition, snakeGame.snake.head)
        Assertions.assertEquals(snakeGame.initialSnakeDirection, snakeGame.snake.direction)
        Assertions.assertEquals(snakeGame.initialFoodPosition, snakeGame.food)
        Assertions.assertTrue(snakeGame.moveRecord.isEmpty())
    }

    @Test
    fun `suicide test 1`() {
        val options = Options(3, 3, null)

        val snakeGame1 = SnakeGame(options)
        snakeGame1.suicide(snakeGame1.snake.direction.opposite)
        Assertions.assertEquals(1, snakeGame1.moves)
        Assertions.assertEquals(1, snakeGame1.movesForNoFood)
        Assertions.assertTrue(snakeGame1.gameOver)
        Assertions.assertEquals(1, snakeGame1.moveRecord.size)
        Assertions.assertEquals(snakeGame1.snake.direction.opposite.value, snakeGame1.moveRecord[0])

        val snakeGame2 = SnakeGame(options)
        snakeGame2.snakeMoveBySnakeAction(SnakeAction.FRONT)
        val movesForNoFoodBeforeSuicide = snakeGame2.movesForNoFood
        snakeGame2.suicide(snakeGame2.snake.direction.opposite)
        Assertions.assertEquals(2, snakeGame2.moves)
        Assertions.assertEquals(movesForNoFoodBeforeSuicide + 1, snakeGame2.movesForNoFood)
        Assertions.assertTrue(snakeGame2.gameOver)
        Assertions.assertEquals(2, snakeGame2.moveRecord.size)
        Assertions.assertEquals(snakeGame2.snake.direction.opposite.value, snakeGame2.moveRecord[1])
    }

    @Test
    fun `suicide test toThrowError`() {
        val options = Options(3, 3, null)
        val snakeGame = SnakeGame(options)
        snakeGame.suicide(snakeGame.snake.direction.opposite)
        Assertions.assertTrue(snakeGame.gameOver)
        Assertions.assertThrows(IllegalStateException::class.java) { snakeGame.suicide(Direction.DOWN) }
    }

    @ParameterizedTest
    @MethodSource("checkOutOfBoundsTestData")
    fun `checkOutOfBounds test`(snakeGame: SnakeGame, x: Int, y: Int, expected: Boolean) {
        Assertions.assertEquals(expected, snakeGame.checkOutOfBounds(Position(x, y)))
    }

    @ParameterizedTest
    @MethodSource("getRandomFoodPositionTestData")
    fun `getRandomFoodPosition test`(name: String, snakeGame: SnakeGame) {
        val allowAbleDiffRatio = 0.1
        val simulateTimes = 10000

        val allowablePositions = snakeGame.allPositions.filter { p -> snakeGame.snake.positions.none { it == p } }
        Assertions.assertEquals(allowablePositions.size, snakeGame.allPositions.size - snakeGame.snake.length)
        val countArr = IntArray(allowablePositions.size)

        for (i in 0 until simulateTimes) {
            val foodPosition = snakeGame.getRandomFoodPosition()
            Assertions.assertFalse(snakeGame.snake.positionIsInSnake(foodPosition))
            Assertions.assertTrue(allowablePositions.contains(foodPosition))
            countArr[allowablePositions.indexOf(foodPosition)]++
        }

        val idealAvg = simulateTimes / allowablePositions.size
        val lowerBound = (idealAvg * (1 - allowAbleDiffRatio)).toInt()
        val upperBound = (idealAvg * (1 + allowAbleDiffRatio)).toInt()
        for (count in countArr) {
            Assertions.assertTrue(count in lowerBound..upperBound)
        }
    }

    @Test
    fun `snakeMoveBySnakeAction test`() {
        for (snakeAction in SnakeAction.entries) {
            val snakeGame = SnakeGame(Options(5, 5, null))

            val snakeSpy = spy(snakeGame.snake)
            snakeGame.snake = snakeSpy
            val snakeGameSpy = spy(snakeGame)

            snakeGameSpy.snakeMoveBySnakeAction(snakeAction)
            verify(snakeSpy).getHeadPositionAndDirectionAfterMoveBySnakeAction(snakeAction)
            verify(snakeGameSpy, times(1)).snakeMove(anyOrNull(), anyOrNull())
            Assertions.assertEquals(1, snakeGameSpy.moveRecord.size)
        }
    }

    @Test
    fun `snakeMoveBySnakeAction test toThrowError`() {
        val snakeGame = SnakeGame(Options(2, 2, null))
        snakeGame.suicide(snakeGame.snake.direction.opposite)
        val exception = Assertions.assertThrows(IllegalStateException::class.java) {
            snakeGame.snakeMoveBySnakeAction(SnakeAction.FRONT)
        }
        Assertions.assertEquals("snakeMoveBySnakeAction() is called when game is over", exception.message)
    }

    @Test
    fun `snakeMoveByDirection test`() {
        val allDirections = Direction.entries

        for (direction in allDirections) {
            val snakeGame = snakeGameFactory()

            val snakeSpy = spy(snakeGame.snake)
            snakeGame.snake = snakeSpy
            val snakeGameSpy = spy(snakeGame)

            snakeGameSpy.snakeMoveByDirection(direction)

            if (direction == snakeGame.snake.direction.opposite) {
                verify(snakeSpy, times(0)).getHeadPositionAndDirectionAfterMoveByDirection(anyOrNull())
                verify(snakeGameSpy, times(0)).snakeMove(anyOrNull(), anyOrNull())
                verify(snakeGameSpy, times(1)).suicide(anyOrNull())
                Assertions.assertEquals(1, snakeGameSpy.moveRecord.size)
            } else {
                verify(snakeSpy, times(2)).getHeadPositionAndDirectionAfterMoveByDirection(direction)
                verify(snakeGameSpy, times(1)).snakeMove(anyOrNull(), anyOrNull())
                verify(snakeGameSpy, times(0)).suicide(anyOrNull())
                Assertions.assertEquals(1, snakeGameSpy.moveRecord.size)
            }
        }
    }

    @Test
    fun `snakeMoveByDirection test toThrowError`() {
        val snakeGame = snakeGameFactory()
        snakeGame.suicide(snakeGame.snake.direction.opposite)
        val exception = Assertions.assertThrows(IllegalStateException::class.java) {
            snakeGame.snakeMoveByDirection(Direction.UP)
        }
        Assertions.assertEquals("snakeMoveByDirection() is called when game is over", exception.message)
    }

    @Test
    fun `snakeMoveBySnakeAction test out of bounds`() {
        val snakeGame = SnakeGame(
            Options(
                worldWidth = 3,
                worldHeight = 3,
                providedInitialStatus = ProvidedInitialStatus(
                    snake = SnakeData(
                        positions = mutableListOf(Position(0, 0)),
                        direction = Direction.LEFT,
                        allPositions2D = emptyList()
                    ),
                    food = Position(0, 1),
                    moves = 10,
                    movesForNoFood = 2,
                    gameOver = false,
                    initialSnakePosition = Position(1, 1),
                    initialSnakeDirection = Direction.UP,
                    initialFoodPosition = Position(0, 0),
                    moveRecord = MutableList(10) { 0 }
                )
            )
        )
        snakeGame.snakeMoveBySnakeAction(SnakeAction.FRONT)
        Assertions.assertEquals(11, snakeGame.moves)
        Assertions.assertEquals(3, snakeGame.movesForNoFood)
        Assertions.assertTrue(snakeGame.gameOver)
    }

    @Test
    fun `snakeMoveBySnakeAction test eat self`() {
        val snakeGame = SnakeGame(
            Options(
                worldWidth = 3,
                worldHeight = 3,
                providedInitialStatus = ProvidedInitialStatus(
                    snake = SnakeData(
                        positions = mutableListOf(
                            Position(1, 1),
                            Position(2, 1),
                            Position(2, 2),
                            Position(1, 2),
                            Position(0, 2)
                        ),
                        direction = Direction.LEFT,
                        allPositions2D = emptyList()
                    ),
                    food = Position(0, 0),
                    moves = 10,
                    movesForNoFood = 2,
                    gameOver = false,
                    initialSnakePosition = Position(1, 1),
                    initialSnakeDirection = Direction.UP,
                    initialFoodPosition = Position(0, 0),
                    moveRecord = MutableList(10) { 0 }
                )
            )
        )
        snakeGame.snakeMoveBySnakeAction(SnakeAction.TURN_LEFT)
        Assertions.assertEquals(11, snakeGame.moves)
        Assertions.assertEquals(3, snakeGame.movesForNoFood)
        Assertions.assertTrue(snakeGame.gameOver)
    }

    @Test
    fun `snakeMoveBySnakeAction test eat food and reach max length`() {
        val snakeGame = SnakeGame(
            Options(
                worldWidth = 2,
                worldHeight = 2,
                providedInitialStatus = ProvidedInitialStatus(
                    snake = SnakeData(
                        positions = mutableListOf(
                            Position(0, 0),
                            Position(0, 1),
                            Position(1, 1)
                        ),
                        direction = Direction.UP,
                        allPositions2D = emptyList()
                    ),
                    food = Position(1, 0),
                    moves = 10,
                    movesForNoFood = 2,
                    gameOver = false,
                    initialSnakePosition = Position(1, 1),
                    initialSnakeDirection = Direction.UP,
                    initialFoodPosition = Position(0, 0),
                    moveRecord = MutableList(10) { 0 }
                )
            )
        )
        snakeGame.snakeMoveBySnakeAction(SnakeAction.TURN_RIGHT)
        Assertions.assertEquals(11, snakeGame.moves)
        Assertions.assertEquals(0, snakeGame.movesForNoFood)
        Assertions.assertTrue(snakeGame.gameOver)
        Assertions.assertEquals(4, snakeGame.snake.positions.size)
    }

    @Test
    fun `snakeMoveBySnakeAction test exceed maxTurnOfNoFood`() {
        val snakeGame = SnakeGame(
            Options(
                worldWidth = 3,
                worldHeight = 3,
                providedInitialStatus = ProvidedInitialStatus(
                    snake = SnakeData(
                        positions = mutableListOf(Position(1, 1)),
                        direction = Direction.UP,
                        allPositions2D = emptyList()
                    ),
                    food = Position(0, 0),
                    moves = 999,
                    movesForNoFood = 999,
                    gameOver = false,
                    initialSnakePosition = Position(1, 1),
                    initialSnakeDirection = Direction.UP,
                    initialFoodPosition = Position(0, 0),
                    moveRecord = MutableList(999) { 0 }
                )
            )
        )
        snakeGame.snakeMoveBySnakeAction(SnakeAction.FRONT)
        Assertions.assertEquals(1000, snakeGame.moves)
        Assertions.assertEquals(1000, snakeGame.movesForNoFood)
        Assertions.assertTrue(snakeGame.gameOver)
        Assertions.assertEquals(1, snakeGame.snake.positions.size)
    }

    @Test
    fun `moveRecord test 1`() {
        val snakeGame = SnakeGame(
            Options(
                worldWidth = 3,
                worldHeight = 3,
                providedInitialStatus = ProvidedInitialStatus(
                    snake = SnakeData(
                        positions = mutableListOf(
                            Position(1, 1),
                            Position(2, 1),
                            Position(2, 2),
                            Position(1, 2),
                        ),
                        direction = Direction.LEFT,
                        allPositions2D = emptyList()
                    ),
                    food = Position(0, 0),
                    moves = 10,
                    movesForNoFood = 2,
                    gameOver = false,
                    initialSnakePosition = Position(1, 1),
                    initialSnakeDirection = Direction.UP,
                    initialFoodPosition = Position(0, 0),
                    moveRecord = MutableList(10) { 0 },
                )
            )
        )

        val expectedMoveRecord = MutableList(10) { 0 }

        snakeGame.snakeMoveByDirection(Direction.DOWN) // 1, 2
        expectedMoveRecord.add(1)
        Assertions.assertArrayEquals(expectedMoveRecord.toIntArray(), snakeGame.moveRecord.toIntArray())

        snakeGame.snakeMoveByDirection(Direction.LEFT) // 0, 2
        expectedMoveRecord.add(2)
        Assertions.assertArrayEquals(expectedMoveRecord.toIntArray(), snakeGame.moveRecord.toIntArray())

        snakeGame.snakeMoveByDirection(Direction.UP) // 0, 1
        expectedMoveRecord.add(0)
        Assertions.assertArrayEquals(expectedMoveRecord.toIntArray(), snakeGame.moveRecord.toIntArray())

        snakeGame.snakeMoveByDirection(Direction.RIGHT) // 1, 1
        expectedMoveRecord.add(3)
        Assertions.assertArrayEquals(expectedMoveRecord.toIntArray(), snakeGame.moveRecord.toIntArray())

        snakeGame.snakeMoveByDirection(Direction.UP) // 1, 0
        expectedMoveRecord.add(0)
        Assertions.assertArrayEquals(expectedMoveRecord.toIntArray(), snakeGame.moveRecord.toIntArray())

        snakeGame.snakeMoveByDirection(Direction.LEFT) // 0, 0 eat food
        val oneDIndex = snakeGame.indexInAllPositions(snakeGame.food.x, snakeGame.food.y)
        expectedMoveRecord.add((oneDIndex + 1) * 10 + 2)
        Assertions.assertArrayEquals(expectedMoveRecord.toIntArray(), snakeGame.moveRecord.toIntArray())

        snakeGame.snakeMoveByDirection(Direction.RIGHT) // suicide
        expectedMoveRecord.add(3)
        Assertions.assertArrayEquals(expectedMoveRecord.toIntArray(), snakeGame.moveRecord.toIntArray())
    }

    @Test
    fun `moveRecord test 2`() {
        val snakeGame = SnakeGame(
            Options(
                worldWidth = 3,
                worldHeight = 3,
                providedInitialStatus = ProvidedInitialStatus(
                    snake = SnakeData(
                        positions = listOf(Position(1, 1)),
                        direction = Direction.LEFT,
                        allPositions2D = emptyList()
                    ),
                    food = Position(0, 0),
                    moves = 0,
                    movesForNoFood = 0,
                    gameOver = false,
                    initialSnakePosition = Position(1, 1),
                    initialSnakeDirection = Direction.UP,
                    initialFoodPosition = Position(0, 0),
                    moveRecord = mutableListOf()
                )
            )
        )

        snakeGame.snakeMoveByDirection(Direction.LEFT)
        snakeGame.snakeMoveByDirection(Direction.LEFT)
        Assertions.assertArrayEquals(intArrayOf(2, 2), snakeGame.moveRecord.toIntArray())
    }

    @ParameterizedTest
    @MethodSource("indexInAllPositionsTestData")
    fun `indexInAllPositions test`(name: String, snakeGame: SnakeGame) {
        for (x in 0 until snakeGame.worldWidth) {
            for (y in 0 until snakeGame.worldHeight) {
                val calculatedIndex = snakeGame.indexInAllPositions(x, y)
                val foundIndex = snakeGame.allPositions.indexOfFirst { p -> p.x == x && p.y == y }
                Assertions.assertEquals(foundIndex, calculatedIndex)
            }
        }
    }
}