package snake.ai.ga

import com.example.snake.ai.BaseStats
import com.example.snake.ai.ga.IndividualPlainObject


data class EvolveResult(
    val generation: Int,
    val bestIndividual: IndividualPlainObject,
    val timeSpent: Long,
    val overallStats: OverallStats
)

data class OverallStats(
    val fitness: BaseStats,
    val snakeLength: BaseStats,
    val moves: BaseStats
)