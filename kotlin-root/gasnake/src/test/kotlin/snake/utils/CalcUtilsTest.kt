package snake.ai

import com.example.snake.ai.ActivationFunction
import com.example.snake.utils.CalcUtils
import org.junit.jupiter.api.Assertions.*
import kotlin.test.Test

class CalcUtilsTest {
    companion object {
        private fun List<Int>.toDoubleArray(): DoubleArray {
            return this.map { it.toDouble() }.toDoubleArray()
        }

        private fun List<List<Int>>.toDoubleArray(): List<DoubleArray> {
            return this.map { it.toDoubleArray() }
        }

        val M1 = listOf(
            listOf(0, 1, 2, 3, 4, 5),
            listOf(6, 7, 8, 9, 10, 11),
            listOf(12, 13, 14, 15, 16, 17),
            listOf(18, 19, 20, 21, 22, 23),
            listOf(24, 25, 26, 27, 28, 29),
            listOf(30, 31, 32, 33, 34, 35)
        ).toDoubleArray()

        val M2 = listOf(
            listOf(10, 11, 12, 13, 14, 15),
            listOf(16, 17, 18, 19, 110, 111),
            listOf(112, 113, 114, 115, 116, 117),
            listOf(118, 119, 120, 121, 122, 123),
            listOf(124, 125, 126, 127, 128, 129),
            listOf(130, 131, 132, 133, 134, 135)
        ).toDoubleArray()

        val X1 = listOf(0, 1, 2, 3, 4, 5).toDoubleArray()
        val X2 = listOf(55, 146, 237, 328, 419, 510).toDoubleArray()
        val X3 = listOf(22790, 116571, 195682, 205853, 216024, 226195).toDoubleArray()

        val B1 = listOf(0, 1, 2, 3, 4, 5).toDoubleArray()
        val B2 = listOf(10, 11, 12, 13, 14, 15).toDoubleArray()

        val M1X1 = listOf(55, 145, 235, 325, 415, 505).toDoubleArray()

        val statsSampleArr1 = listOf(-470, -386, 877, -769, -6, 799, 265, 487, -781, -360).toDoubleArray()
        val statsSampleArr2 = listOf(
            0.39450487,
            -0.10545648,
            -0.90960379,
            0.41854961,
            -0.46016425,
            0.50427588,
            0.46510193,
            0.91963169,
            -0.93352642,
            -0.55964653
        ).toDoubleArray()

        val quartileSampleArr = doubleArrayOf(6.0, 7.0, 15.0, 36.0, 39.0, 41.0, 41.0, 43.0, 43.0, 47.0, 49.0)
    }

    @Test
    fun addition() {
        assertArrayEquals(X2, CalcUtils.addition(M1X1, B1))
    }

    @Test
    fun multiplication() {
        assertArrayEquals(M1X1, CalcUtils.multiplication(M1, X1))
    }

    @Test
    fun computeOneLayer() {
        assertAll(
            { assertArrayEquals(X2, CalcUtils.computeOneLayer(M1, X1, B1)) },
            { assertArrayEquals(X3, CalcUtils.computeOneLayer(M2, X2, B2)) }
        )
    }

    @Test
    fun computeMultipleLayer() {
        assertArrayEquals(
            X3,
            CalcUtils.computeMultipleLayer(
                listOf(M1, M2),
                X1,
                listOf(B1, B2),
                ActivationFunction.LINEAR
            )
        )
    }

    @Test
    fun indexOfMaxValueInArray() {
        assertAll(
            {
                assertEquals(
                    9,
                    CalcUtils.indexOfMaxValueInArray(listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).toDoubleArray())
                )
            },
            {
                assertEquals(
                    4,
                    CalcUtils.indexOfMaxValueInArray(listOf(6, 7, 8, 9, 10, 1, 2, 3, 4, 5).toDoubleArray())
                )
            },
            { assertEquals(0, CalcUtils.indexOfMaxValueInArray(listOf(-1, -2, -3, -4, -5, -6).toDoubleArray())) },
            { assertEquals(2, CalcUtils.indexOfMaxValueInArray(listOf(1, 2, 3, -1, -2, -3).toDoubleArray())) }
        )
    }

    @Test
    fun minmax() {
        assertAll(
            { assertEquals(0.5, CalcUtils.minmax(-1.0, 0.5, 1.0)) },
            { assertEquals(1.0, CalcUtils.minmax(-1.0, 127.0, 1.0)) },
            { assertEquals(-1.0, CalcUtils.minmax(-1.0, -127.0, 1.0)) },
            { assertEquals(0.5, CalcUtils.minmax(-5.0, 0.5, 5.0)) },
            { assertEquals(5.0, CalcUtils.minmax(-5.0, 127.0, 5.0)) },
            { assertEquals(-3.0, CalcUtils.minmax(-3.0, -127.0, 1.0)) }
        )
    }

    @Test
    fun `stats minOfArray`() {
        assertAll(
            { assertEquals(1.0, CalcUtils.minOfArray(listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).toDoubleArray())) },
            { assertEquals(1.0, CalcUtils.minOfArray(listOf(6, 7, 8, 9, 10, 1, 2, 3, 4, 5).toDoubleArray())) },
            {
                assertEquals(
                    -10.0,
                    CalcUtils.minOfArray(listOf(-6, -7, -8, -9, -10, -1, -2, -3, -4, -5).toDoubleArray())
                )
            },
            { assertEquals(-781.0, CalcUtils.minOfArray(statsSampleArr1)) },
            { assertEquals(-0.93352642, CalcUtils.minOfArray(statsSampleArr2)) }
        )
    }

    @Test
    fun `stats maxOfArray`() {
        assertAll(
            { assertEquals(10.0, CalcUtils.maxOfArray(listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).toDoubleArray())) },
            { assertEquals(10.0, CalcUtils.maxOfArray(listOf(6, 7, 8, 9, 10, 1, 2, 3, 4, 5).toDoubleArray())) },
            {
                assertEquals(
                    -1.0,
                    CalcUtils.maxOfArray(listOf(-6, -7, -8, -9, -10, -1, -2, -3, -4, -5).toDoubleArray())
                )
            },
            { assertEquals(877.0, CalcUtils.maxOfArray(statsSampleArr1)) },
            { assertEquals(0.91963169, CalcUtils.maxOfArray(statsSampleArr2)) }
        )
    }

    @Test
    fun `stats meanOfArray`() {
        assertAll(
            { assertEquals(-34.4, CalcUtils.meanOfArray(statsSampleArr1), 0.0001) },
            { assertEquals(-0.026633349, CalcUtils.meanOfArray(statsSampleArr2), 0.0001) }
        )
    }

    @Test
    fun `stats sdOfArray`() {
        assertAll(
            { assertEquals(583.433320954503, CalcUtils.sdOfArray(statsSampleArr1)) },
            { assertEquals(0.6224940164933749, CalcUtils.sdOfArray(statsSampleArr2)) }
        )
    }

    @Test
    fun `stats lowerQuartileOfArray`() {
        assertAll(
            { assertEquals(15.0, CalcUtils.lowerQuartileOfArray(quartileSampleArr)) },
            { assertEquals(-470.0, CalcUtils.lowerQuartileOfArray(statsSampleArr1)) },
            { assertEquals(-0.55964653, CalcUtils.lowerQuartileOfArray(statsSampleArr2)) }
        )
    }

    @Test
    fun `stats medianOfArray`() {
        assertAll(
            { assertEquals(41.0, CalcUtils.medianOfArray(quartileSampleArr)) },
            { assertEquals(-6.0, CalcUtils.medianOfArray(statsSampleArr1)) },
            { assertEquals(0.39450487, CalcUtils.medianOfArray(statsSampleArr2)) }
        )
    }

    @Test
    fun `stats upperQuartileOfArray`() {
        assertAll(
            { assertEquals(43.0, CalcUtils.upperQuartileOfArray(quartileSampleArr)) },
            { assertEquals(487.0, CalcUtils.upperQuartileOfArray(statsSampleArr1)) },
            { assertEquals(0.46510193, CalcUtils.upperQuartileOfArray(statsSampleArr2)) }
        )
    }
}