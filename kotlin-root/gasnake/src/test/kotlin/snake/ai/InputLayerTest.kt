package snake.ai

import com.example.snake.ai.InputLayer
import com.example.snake.ai.RelativePosition.Companion.slopeMap4
import com.example.snake.game.*
import com.example.snake.game.typing.Direction
import com.google.gson.Gson
import org.junit.jupiter.api.Assertions.assertArrayEquals
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Nested
import kotlin.test.Test

class InputLayerTest {
    companion object {
        val game1 = SnakeGame(
            Options(
                worldWidth = 20,
                worldHeight = 20,
                providedInitialStatus = ProvidedInitialStatus(
                    snake = SnakeData(
                        positions = listOf(Position(6, 9)),
                        direction = Direction.UP,
                        allPositions2D = emptyList()
                    ),
                    food = Position(6, 8),
                    gameOver = false,
                    moves = 0,
                    movesForNoFood = 0,
                    initialSnakePosition = Position(10, 10),
                    initialSnakeDirection = Direction.UP,
                    initialFoodPosition = Position(0, 0),
                    moveRecord = mutableListOf()
                )
            )
        )

        val positions2 = """
                        [{"x":19,"y":0},{"x":19,"y":1},{"x":19,"y":2},{"x":19,"y":3},{"x":19,"y":4},{"x":19,"y":5},{"x":19,"y":6},{"x":19,"y":7},{"x":19,"y":8},{"x":19,"y":9},{"x":19,"y":10},{"x":18,"y":10},{"x":17,"y":10},{"x":16,"y":10},{"x":15,"y":10},{"x":14,"y":10},{"x":13,"y":10},{"x":12,"y":10},{"x":11,"y":10},{"x":11,"y":9},{"x":11,"y":8},{"x":11,"y":7},{"x":12,"y":7},{"x":12,"y":6},{"x":12,"y":5},{"x":11,"y":5},{"x":10,"y":5},{"x":9,"y":5},{"x":8,"y":5},{"x":7,"y":5},{"x":6,"y":5},{"x":5,"y":5},{"x":4,"y":5},{"x":3,"y":5},{"x":2,"y":5},{"x":1,"y":5},{"x":1,"y":6},{"x":1,"y":7},{"x":1,"y":8},{"x":1,"y":9},{"x":1,"y":10},{"x":1,"y":11},{"x":1,"y":12},{"x":1,"y":13},{"x":1,"y":14},{"x":1,"y":15},{"x":1,"y":16},{"x":1,"y":17},{"x":1,"y":18},{"x":1,"y":19}]
                        """.trimIndent()

        val game2 = SnakeGame(
            Options(
                worldWidth = 20,
                worldHeight = 20,
                providedInitialStatus = ProvidedInitialStatus(
                    snake = SnakeData(
                        positions = Gson().fromJson(positions2, Array<Position>::class.java).toList(),
                        direction = Direction.UP,
                        allPositions2D = emptyList()
                    ),
                    food = Position(12, 2),
                    gameOver = false,
                    moves = 1000,
                    movesForNoFood = 0,
                    initialSnakePosition = Position(10, 10),
                    initialSnakeDirection = Direction.UP,
                    initialFoodPosition = Position(0, 0),
                    moveRecord = mutableListOf()
                )
            )
        )

        val positions3 = """
                        [{"x":6,"y":8},{"x":6,"y":7},{"x":6,"y":6},{"x":7,"y":6},{"x":8,"y":6},{"x":9,"y":6},{"x":10,"y":6},{"x":11,"y":6},{"x":12,"y":6},{"x":12,"y":7},{"x":11,"y":7},{"x":10,"y":7},{"x":10,"y":8},{"x":10,"y":9},{"x":10,"y":10},{"x":9,"y":10},{"x":8,"y":10},{"x":8,"y":11},{"x":9,"y":11},{"x":10,"y":11},{"x":11,"y":11},{"x":12,"y":11},{"x":13,"y":11},{"x":14,"y":11},{"x":14,"y":10},{"x":15,"y":10},{"x":15,"y":9},{"x":15,"y":8},{"x":16,"y":8},{"x":17,"y":8},{"x":18,"y":8},{"x":18,"y":7},{"x":18,"y":6},{"x":18,"y":5},{"x":18,"y":4},{"x":17,"y":4},{"x":17,"y":3},{"x":17,"y":2},{"x":16,"y":2},{"x":15,"y":2},{"x":15,"y":1},{"x":14,"y":1},{"x":13,"y":1},{"x":12,"y":1},{"x":11,"y":1},{"x":10,"y":1},{"x":9,"y":1},{"x":8,"y":1},{"x":7,"y":1},{"x":7,"y":2},{"x":7,"y":3},{"x":8,"y":3},{"x":9,"y":3},{"x":10,"y":3},{"x":11,"y":3},{"x":12,"y":3},{"x":13,"y":3},{"x":13,"y":4},{"x":12,"y":4},{"x":11,"y":4},{"x":10,"y":4},{"x":9,"y":4},{"x":8,"y":4},{"x":7,"y":4},{"x":6,"y":4},{"x":5,"y":4},{"x":4,"y":4},{"x":3,"y":4},{"x":3,"y":5},{"x":2,"y":5},{"x":1,"y":5},{"x":1,"y":6},{"x":1,"y":7},{"x":1,"y":8},{"x":1,"y":9},{"x":1,"y":10},{"x":1,"y":11},{"x":2,"y":11},{"x":2,"y":12},{"x":3,"y":12},{"x":4,"y":12},{"x":4,"y":13},{"x":5,"y":13},{"x":6,"y":13},{"x":6,"y":14},{"x":7,"y":14},{"x":7,"y":15},{"x":8,"y":15},{"x":9,"y":15},{"x":10,"y":15},{"x":11,"y":15},{"x":12,"y":15},{"x":12,"y":16},{"x":12,"y":17},{"x":12,"y":18},{"x":11,"y":18}]
                        """.trimIndent()

        val game3 = SnakeGame(
            Options(
                worldWidth = 20,
                worldHeight = 20,
                providedInitialStatus = ProvidedInitialStatus(
                    snake = SnakeData(
                        positions = Gson().fromJson(positions3, Array<Position>::class.java).toList(),
                        direction = Direction.DOWN,
                        allPositions2D = emptyList()
                    ),
                    food = Position(15, 15),
                    gameOver = false,
                    moves = 1800,
                    movesForNoFood = 0,
                    initialSnakePosition = Position(10, 10),
                    initialSnakeDirection = Direction.UP,
                    initialFoodPosition = Position(0, 0),
                    moveRecord = mutableListOf()
                )
            )
        )

        val inputLayer1 = InputLayer(game1)
        val inputLayer2 = InputLayer(game2)
        val inputLayer3 = InputLayer(game3)
    }

    @Nested
    inner class FoodSnakeOutOfBoundValueTestSuite {
        @Test
        fun `game1 test`() {
            val food = doubleArrayOf(0.0, 0.0, 1.0, 0.0)
            val snake = doubleArrayOf(0.0, 0.0, 0.0, 0.0)
            val outOfBound = doubleArrayOf(0.0, 0.0, 0.0, 0.0)
            val expectedResult = food + snake + outOfBound

            val result = inputLayer1.foodSnakeOutOfBoundValue(slopeMap4)
            assertArrayEquals(expectedResult, result)
        }

        @Test
        fun `game2 test`() {
            val food = doubleArrayOf(0.0, 0.0, 0.0, 0.0)
            val snake = doubleArrayOf(1.0, 0.0, 0.0, 0.0)
            val outOfBound = doubleArrayOf(0.0, 1.0, 1.0, 0.0)
            val expectedResult = food + snake + outOfBound

            val result = inputLayer2.foodSnakeOutOfBoundValue(slopeMap4)
            assertArrayEquals(expectedResult, result)
        }

        @Test
        fun `game3 test`() {
            val food = doubleArrayOf(0.0, 0.0, 0.0, 0.0)
            val snake = doubleArrayOf(0.0, 0.0, 1.0, 0.0)
            val outOfBound = doubleArrayOf(0.0, 0.0, 0.0, 0.0)
            val expectedResult = food + snake + outOfBound

            val result = inputLayer3.foodSnakeOutOfBoundValue(slopeMap4)
            assertArrayEquals(expectedResult, result)
        }
    }


    @Nested
    inner class CurrentDirectionValueTestSuite {

        @Test
        fun `game1 test`() {
            val expectedResult = doubleArrayOf(1.0, 0.0, 0.0, 0.0)
            val result = inputLayer1.currentDirectionValue()
            assertArrayEquals(expectedResult, result)
        }

        @Test
        fun `game2 test`() {
            val expectedResult = doubleArrayOf(1.0, 0.0, 0.0, 0.0)
            val result = inputLayer2.currentDirectionValue()
            assertArrayEquals(expectedResult, result)
        }

        @Test
        fun `game3 test`() {
            val expectedResult = doubleArrayOf(0.0, 1.0, 0.0, 0.0)
            val result = inputLayer3.currentDirectionValue()
            assertArrayEquals(expectedResult, result)
        }
    }


    @Nested
    inner class FoodDistanceValueTestSuite {

        @Test
        fun `game1 test`() {
            val expectedResult = doubleArrayOf(1.0, 0.0, 0.0, 0.0)
            val result = inputLayer1.foodDistanceValue()
            assertArrayEquals(expectedResult, result)
        }

        @Test
        fun `game2 test`() {
            val result = inputLayer2.foodDistanceValue()
            val expectedResult = doubleArrayOf(0.0, 1.0 / 2, 1.0 / 7, 0.0)
            expectedResult.forEachIndexed { index, expected ->
                assertEquals(expected, result[index], 1e-6)
            }
        }

        @Test
        fun `game3 test`() {
            val result = inputLayer3.foodDistanceValue()
            val expectedResult = doubleArrayOf(0.0, 1.0 / 7, 0.0, 1.0 / 9)
            expectedResult.forEachIndexed { index, expected ->
                assertEquals(expected, result[index], 1e-6)
            }
        }
    }

    @Nested
    inner class SnakePortionValueTestSuite {

        @Test
        fun `game1 test`() {
            val expectedResult = doubleArrayOf(0.0, 0.0, 0.0, 0.0)
            val result = inputLayer1.snakePortionValue()
            assertArrayEquals(expectedResult, result)
        }

        @Test
        fun `game2 test`() {
            val worldSize = 20.0 * 20.0
            val result = inputLayer2.snakePortionValue()
            val expectedResult = doubleArrayOf(0.0, 49.0 / worldSize, 39.0 / worldSize, 0.0)
            expectedResult.forEachIndexed { index, expected ->
                assertEquals(expected, result[index], 1e-6)
            }
        }

        @Test
        fun `game3 test`() {
            val worldSize = 20.0 * 20.0
            val result = inputLayer3.snakePortionValue()
            val expectedResult = doubleArrayOf(53.0 / worldSize, 36.0 / worldSize, 18.0 / worldSize, 72.0 / worldSize)
            expectedResult.forEachIndexed { index, expected ->
                assertEquals(expected, result[index], 1e-6)
            }
        }
    }

    @Nested
    inner class GetSnakeLengthWorldRatioTestSuite {

        @Test
        fun `game1 test`() {
            val expectedResult = 1.0 / (20.0 * 20.0)
            val result = inputLayer1.getSnakeLengthWorldRatio()
            assertEquals(expectedResult, result, 1e-6)
        }

        @Test
        fun `game2 test`() {
            val expectedResult = 50.0 / (20.0 * 20.0)
            val result = inputLayer2.getSnakeLengthWorldRatio()
            assertEquals(expectedResult, result, 1e-6)
        }

        @Test
        fun `game3 test`() {
            val expectedResult = 96.0 / (20.0 * 20.0)
            val result = inputLayer3.getSnakeLengthWorldRatio()
            assertEquals(expectedResult, result, 1e-6)
        }
    }
}