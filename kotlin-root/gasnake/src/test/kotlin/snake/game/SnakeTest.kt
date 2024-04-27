package snake.game

import com.example.snake.game.*
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.Arguments
import org.junit.jupiter.params.provider.MethodSource
import java.util.stream.Stream

class SnakeTest {

    companion object {
        @JvmStatic
        private val allPositions2D = listOf(
            listOf(Position(0, 0), Position(1, 0), Position(2, 0)),
            listOf(Position(0, 1), Position(1, 1), Position(2, 1)),
            listOf(Position(0, 2), Position(1, 2), Position(2, 2))
        )

        @JvmStatic
        fun provideTestDataHeaderAndLength(): Stream<Arguments> {
            val snake1 = Snake(mutableListOf(Position(0, 1)), Direction.LEFT, allPositions2D)
            val snake2 =
                Snake(mutableListOf(Position(0, 1), Position(1, 1), Position(1, 2)), Direction.LEFT, allPositions2D)
            return Stream.of(
                Arguments.of("test 1", snake1, Position(0, 1), 1),
                Arguments.of("test 2", snake2, Position(0, 1), 3)
            )
        }

        @JvmStatic
        fun provideTestDataForPositionInSnake(): Stream<Arguments> {
            val snake1 = Snake(mutableListOf(Position(0, 1)), Direction.LEFT, allPositions2D)
            val snake2 =
                Snake(mutableListOf(Position(0, 1), Position(1, 1), Position(1, 2)), Direction.LEFT, allPositions2D)
            return Stream.of(
                Arguments.of("test 1", snake1, Position(0, 1), true),
                Arguments.of("test 2", snake1, Position(1, 1), false),
                Arguments.of("test 3", snake1, Position(1, 2), false),
                Arguments.of("test 4", snake2, Position(0, 1), true),
                Arguments.of("test 5", snake2, Position(1, 1), true),
                Arguments.of("test 6", snake2, Position(1, 2), true),
                Arguments.of("test 7", snake2, Position(0, 2), false),
                Arguments.of("test 8", snake2, Position(2, 2), false),
                Arguments.of("test 9", snake2, Position(2, 1), false),
                Arguments.of("test 10", snake2, Position(2, 0), false)
            )
        }

        @JvmStatic
        fun provideTestDataForCheckEatSelfAfterMove(): Stream<Arguments> {
            val snake1 = { Snake(mutableListOf(Position(1, 1)), Direction.DOWN, allPositions2D) }
            val snake2 = {
                Snake(
                    mutableListOf(Position(1, 1), Position(1, 2), Position(2, 2), Position(2, 1)),
                    Direction.UP,
                    allPositions2D
                )
            }
            return Stream.of(
                Arguments.of("test 1", snake1(), Direction.UP, false),
                Arguments.of("test 2", snake1(), Direction.LEFT, false),
                Arguments.of("test 3", snake1(), Direction.RIGHT, false),
                Arguments.of("test 4", snake2(), Direction.DOWN, true),
                Arguments.of("test 5", snake2(), Direction.LEFT, false),
                Arguments.of("test 6", snake2(), Direction.RIGHT, false)
            )
        }

        @JvmStatic
        fun provideTestDataForGetHeadPositionAndDirectionAfterMoveBySnakeAction(): Stream<Arguments> {
            val snake1 = Snake(mutableListOf(Position(1, 1)), Direction.UP, allPositions2D)
            val snake2 = Snake(mutableListOf(Position(1, 1)), Direction.DOWN, allPositions2D)
            val snake3 = Snake(mutableListOf(Position(1, 1)), Direction.LEFT, allPositions2D)
            val snake4 = Snake(mutableListOf(Position(1, 1)), Direction.RIGHT, allPositions2D)
            val snake5 = Snake(mutableListOf(Position(0, 0)), Direction.UP, allPositions2D)
            val snake6 = Snake(mutableListOf(Position(2, 2)), Direction.DOWN, allPositions2D)
            return Stream.of(
                Arguments.of("snake1, FRONT", snake1, SnakeAction.FRONT, Position(1, 0), Direction.UP),
                Arguments.of("snake1, TURN_LEFT", snake1, SnakeAction.TURN_LEFT, Position(0, 1), Direction.LEFT),
                Arguments.of("snake1, TURN_RIGHT", snake1, SnakeAction.TURN_RIGHT, Position(2, 1), Direction.RIGHT),
                Arguments.of("snake2, FRONT", snake2, SnakeAction.FRONT, Position(1, 2), Direction.DOWN),
                Arguments.of("snake2, TURN_LEFT", snake2, SnakeAction.TURN_LEFT, Position(2, 1), Direction.RIGHT),
                Arguments.of("snake2, TURN_RIGHT", snake2, SnakeAction.TURN_RIGHT, Position(0, 1), Direction.LEFT),
                Arguments.of("snake3, FRONT", snake3, SnakeAction.FRONT, Position(0, 1), Direction.LEFT),
                Arguments.of("snake3, TURN_LEFT", snake3, SnakeAction.TURN_LEFT, Position(1, 2), Direction.DOWN),
                Arguments.of("snake3, TURN_RIGHT", snake3, SnakeAction.TURN_RIGHT, Position(1, 0), Direction.UP),
                Arguments.of("snake4, FRONT", snake4, SnakeAction.FRONT, Position(2, 1), Direction.RIGHT),
                Arguments.of("snake4, TURN_LEFT", snake4, SnakeAction.TURN_LEFT, Position(1, 0), Direction.UP),
                Arguments.of("snake4, TURN_RIGHT", snake4, SnakeAction.TURN_RIGHT, Position(1, 2), Direction.DOWN),
                Arguments.of("snake5, FRONT", snake5, SnakeAction.FRONT, null, Direction.UP),
                Arguments.of("snake5, TURN_LEFT", snake5, SnakeAction.TURN_LEFT, null, Direction.LEFT),
                Arguments.of("snake5, TURN_RIGHT", snake5, SnakeAction.TURN_RIGHT, Position(1, 0), Direction.RIGHT),
                Arguments.of("snake6, FRONT", snake6, SnakeAction.FRONT, null, Direction.DOWN),
                Arguments.of("snake6, TURN_LEFT", snake6, SnakeAction.TURN_LEFT, null, Direction.RIGHT),
                Arguments.of("snake6, TURN_RIGHT", snake6, SnakeAction.TURN_RIGHT, Position(1, 2), Direction.LEFT)
            )
        }

        @JvmStatic
        fun provideTestDataForGetHeadPositionAndDirectionAfterMoveByDirection(): Stream<Arguments> {
            val snake1 = Snake(mutableListOf(Position(1, 1)), Direction.UP, allPositions2D)
            val snake2 = Snake(mutableListOf(Position(0, 0)), Direction.UP, allPositions2D)
            return Stream.of(
                Arguments.of("snake1, UP", snake1, Direction.UP, Position(1, 0), Direction.UP),
                Arguments.of("snake1, DOWN", snake1, Direction.DOWN, Position(1, 2), Direction.DOWN),
                Arguments.of("snake1, LEFT", snake1, Direction.LEFT, Position(0, 1), Direction.LEFT),
                Arguments.of("snake1, RIGHT", snake1, Direction.RIGHT, Position(2, 1), Direction.RIGHT),
                Arguments.of("snake2, UP", snake2, Direction.UP, null, Direction.UP),
                Arguments.of("snake2, DOWN", snake2, Direction.DOWN, Position(0, 1), Direction.DOWN),
                Arguments.of("snake2, LEFT", snake2, Direction.LEFT, null, Direction.LEFT),
                Arguments.of("snake2, RIGHT", snake2, Direction.RIGHT, Position(1, 0), Direction.RIGHT)
            )
        }
    }

    @Test
    fun `toPlainObject test`() {
        val snake = Snake(mutableListOf(Position(0, 1), Position(1, 1), Position(1, 2)), Direction.LEFT, allPositions2D)
        val plainObj = snake.toPlainObject()
        val expectedPositions = listOf(
            Position(0, 1),
            Position(1, 1),
            Position(1, 2)
        )
        val expectedAllPositions2d = allPositions2D
        val expectedPlainObj = SnakeData(expectedPositions, Direction.LEFT, expectedAllPositions2d)
        Assertions.assertEquals(expectedPlainObj, plainObj)
    }

    @Test
    fun `toPlainObjectWithoutAllPositions2D test`() {
        val snake = Snake(mutableListOf(Position(0, 1), Position(1, 1), Position(1, 2)), Direction.LEFT, allPositions2D)
        val plainObj = snake.toPlainObjectWithoutAllPositions2D()
        val expectedPositions = listOf(
            Position(0, 1),
            Position(1, 1),
            Position(1, 2)
        )
        val expectedPlainObj = SnakeData(
            positions = expectedPositions,
            direction = Direction.LEFT,
            allPositions2D = emptyList()
        )
        Assertions.assertEquals(expectedPlainObj, plainObj)
    }


    @ParameterizedTest
    @MethodSource("provideTestDataHeaderAndLength")
    fun `test suite for getter head and length`(
        name: String,
        snake: Snake,
        expectedHeadPosition: Position,
        expectedLength: Int
    ) {
        Assertions.assertEquals(expectedHeadPosition, snake.head)
        Assertions.assertEquals(expectedLength, snake.length)
    }

    @ParameterizedTest
    @MethodSource("provideTestDataForPositionInSnake")
    fun `positionInSnake tests`(name: String, snake: Snake, position: Position, expected: Boolean) {
        Assertions.assertEquals(expected, snake.positionIsInSnake(position))
    }


    @ParameterizedTest
    @MethodSource("provideTestDataForCheckEatSelfAfterMove")
    fun `checkEatSelfAfterMove tests`(name: String, snake: Snake, direction: Direction, expected: Boolean) {
        val positionAndDirection = snake.getHeadPositionAndDirectionAfterMoveByDirection(direction)
        val position = positionAndDirection.position ?: throw IllegalArgumentException("position is null")
        Assertions.assertEquals(expected, snake.checkEatSelfAfterMove(position))
    }

    @ParameterizedTest
    @MethodSource("provideTestDataForGetHeadPositionAndDirectionAfterMoveBySnakeAction")
    fun `getHeadPositionAndDirectionAfterMoveBySnakeAction tests`(
        name: String,
        snake: Snake,
        action: SnakeAction,
        expectedPosition: Position?,
        expectedDirection: Direction
    ) {
        val positionAndDirection = snake.getHeadPositionAndDirectionAfterMoveBySnakeAction(action)
        Assertions.assertEquals(expectedPosition, positionAndDirection.position)
        Assertions.assertEquals(expectedDirection, positionAndDirection.direction)
    }

    @ParameterizedTest
    @MethodSource("provideTestDataForGetHeadPositionAndDirectionAfterMoveByDirection")
    fun `getHeadPositionAndDirectionAfterMoveByDirection tests`(
        name: String,
        snake: Snake,
        direction: Direction,
        expectedPosition: Position?,
        expectedDirection: Direction
    ) {
        val positionAndDirection = snake.getHeadPositionAndDirectionAfterMoveByDirection(direction)
        Assertions.assertEquals(expectedPosition, positionAndDirection.position)
        Assertions.assertEquals(expectedDirection, positionAndDirection.direction)
    }

    @Test
    fun `move test 1`() {
        for (direction in Direction.entries) {
            for (snakeAction in SnakeAction.entries) {
                val snake = Snake(mutableListOf(Position(1, 1)), direction, allPositions2D)
                val positionAndDirection = snake.getHeadPositionAndDirectionAfterMoveBySnakeAction(snakeAction)
                val position = positionAndDirection.position ?: throw IllegalArgumentException("position is null")
                snake.move(positionAndDirection.direction)
                Assertions.assertEquals(1, snake.length)
                Assertions.assertEquals(listOf(position), snake.positions)
                Assertions.assertEquals(positionAndDirection.direction, snake.direction)
            }
        }
    }

    @Test
    fun `move test 2`() {
        val positions = mutableListOf(Position(1, 1), Position(1, 2), Position(2, 2), Position(2, 1))

        for (snakeAction in SnakeAction.entries) {
            val snake = Snake(positions, Direction.UP, allPositions2D)
            val positionAndDirection = snake.getHeadPositionAndDirectionAfterMoveBySnakeAction(snakeAction)
            val position = positionAndDirection.position ?: throw IllegalArgumentException("position is null")
            snake.move(positionAndDirection.direction)
            Assertions.assertEquals(4, snake.length)
            Assertions.assertEquals(listOf(position, positions[0], positions[1], positions[2]), snake.positions)
            Assertions.assertEquals(positionAndDirection.direction, snake.direction)
        }
    }

    @Test
    fun `moveWithFoodEaten test 1`() {
        for (direction in Direction.entries) {
            for (snakeAction in SnakeAction.entries) {
                val snake = Snake(mutableListOf(Position(1, 1)), direction, allPositions2D)
                val positionAndDirection = snake.getHeadPositionAndDirectionAfterMoveBySnakeAction(snakeAction)
                val position = positionAndDirection.position ?: throw IllegalArgumentException("position is null")
                snake.moveWithFoodEaten(positionAndDirection.direction)
                Assertions.assertEquals(2, snake.length)
                Assertions.assertEquals(listOf(position, Position(1, 1)), snake.positions)
                Assertions.assertEquals(positionAndDirection.direction, snake.direction)
            }
        }
    }

    @Test
    fun `moveWithFoodEaten test 2`() {
        val positions = mutableListOf(Position(1, 1), Position(1, 2), Position(2, 2), Position(2, 1))

        for (snakeAction in SnakeAction.entries) {
            val snake = Snake(positions, Direction.UP, allPositions2D)
            val positionAndDirection = snake.getHeadPositionAndDirectionAfterMoveBySnakeAction(snakeAction)
            val position = positionAndDirection.position ?: throw IllegalArgumentException("position is null")
            snake.moveWithFoodEaten(positionAndDirection.direction)
            Assertions.assertEquals(5, snake.length)
            Assertions.assertEquals(
                listOf(position, positions[0], positions[1], positions[2], positions[3]),
                snake.positions
            )
            Assertions.assertEquals(positionAndDirection.direction, snake.direction)
        }
    }

    @Test
    fun `move and moveWithFoodEaten test throw Error (opposite direction)`() {
        val exceptionClass = IllegalArgumentException::class.java
        val exceptionMsg = "Snake cannot move to opposite direction"

        val snake1 = Snake(mutableListOf(Position(1, 1)), Direction.UP, allPositions2D)
        val exception1 = Assertions.assertThrows(exceptionClass) { snake1.move(Direction.DOWN) }
        Assertions.assertEquals(exceptionMsg, exception1.message)

        val snake2 = Snake(mutableListOf(Position(1, 1)), Direction.UP, allPositions2D)
        val exception2 = Assertions.assertThrows(exceptionClass) { snake2.moveWithFoodEaten(Direction.DOWN) }
        Assertions.assertEquals(exceptionMsg, exception2.message)
    }

    @Test
    fun `move and moveWithFoodEaten test throw Error (out of bound)`() {
        val exceptionClass = IllegalArgumentException::class.java
        val exceptionMsg = "Snake move will be out of bounds"

        val snake1 = Snake(mutableListOf(Position(1, 1)), Direction.UP, allPositions2D)
        snake1.move(Direction.UP)
        val exception1 = Assertions.assertThrows(exceptionClass) { snake1.move(Direction.UP) }
        Assertions.assertEquals(exceptionMsg, exception1.message)

        val snake2 = Snake(mutableListOf(Position(1, 1)), Direction.UP, allPositions2D)
        snake2.moveWithFoodEaten(Direction.UP)
        val exception2 = Assertions.assertThrows(exceptionClass) { snake2.moveWithFoodEaten(Direction.UP) }
        Assertions.assertEquals(exceptionMsg, exception2.message)
    }
}