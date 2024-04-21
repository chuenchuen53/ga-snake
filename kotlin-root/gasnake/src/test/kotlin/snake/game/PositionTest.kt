package snake.game

import com.example.snake.game.Position
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.Arguments
import org.junit.jupiter.params.provider.MethodSource
import java.util.stream.Stream

class PositionTest {

    companion object {
        @JvmStatic
        fun provideTestData(): Stream<Arguments> {
            return Stream.of(
                Arguments.of(Position(1, 2), Position(1, 2), true),
                Arguments.of(Position(1, 2), Position(1, 3), false),
                Arguments.of(Position(5, 3), Position(5, 3), true),
                Arguments.of(Position(5, 3), Position(1, 3), false),
            )
        }
    }

    @ParameterizedTest
    @MethodSource("provideTestData")
    fun `isEqual test`(positionData: Position, otherPositionData: Position, expected: Boolean) {
        Assertions.assertEquals(expected, positionData == otherPositionData)
    }
}