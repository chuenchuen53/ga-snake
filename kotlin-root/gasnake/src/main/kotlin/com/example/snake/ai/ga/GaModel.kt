package com.example.snake.ai.ga

import com.example.snake.ai.ActivationFunction
import com.example.snake.ai.InputLayer
import com.example.snake.ai.ProvidedWeightsAndBiases
import com.example.snake.ai.SnakeBrain
import com.example.snake.ai.multithread.MultiThreadGames
import com.example.snake.game.SnakeGame
import com.example.snake.utils.CalcUtils
import kotlin.math.pow
import kotlin.random.Random

class GaModel(options: Options) {
    companion object {
        fun generateLayerShape(vararg args: Int): List<List<Int>> = List(args.size - 1) { index ->
            listOf(args[index + 1], args[index])
        }

        fun fitness(moves: Int, snakeLength: Int, maxPossibleSnakeLength: Int): Double {
            if (snakeLength == 1) return 0.0

            val ratioOfLength = snakeLength.toDouble() / maxPossibleSnakeLength

            // for short snake
            val moveScore = moves * 10
            val cyclicPenalty = moves * 6 * (1 - ratioOfLength).pow(2)

            // for long snake
            val lengthScore = (snakeLength - 1).toDouble().pow(2 + 6 * ratioOfLength) * maxPossibleSnakeLength * moves

            return moveScore - cyclicPenalty + lengthScore
        }

        fun calculateCumulativeSum(values: List<Double>): List<Double> {
            val prefixSum = mutableListOf<Double>()
            var sum = 0.0
            for (x in values) {
                sum += x
                prefixSum.add(sum)
            }
            return prefixSum
        }

        fun spinRouletteWheel(candidates: List<Individual>, prefixSum: List<Double>): Individual {
            val totalScore = prefixSum.last()
            val randomNum = Random.nextDouble() * totalScore
            val index = CalcUtils.binarySearch(prefixSum, randomNum)
            return candidates[index]
        }
    }

    val worldWidth: Int = options.worldWidth
    val worldHeight: Int = options.worldHeight
    val hiddenLayersLength: List<Int> = options.snakeBrainConfig.hiddenLayersLength
    val hiddenLayerActivationFunction: ActivationFunction = options.snakeBrainConfig.hiddenLayerActivationFunction
    val populationSize: Int = options.gaConfig.populationSize
    val surviveRate: Double = options.gaConfig.surviveRate
    val populationMutationRate: Double = options.gaConfig.populationMutationRate
    val geneMutationRate: Double = options.gaConfig.geneMutationRate
    val mutationAmount: Double = options.gaConfig.mutationAmount
    val trialTimes: Int = options.gaConfig.trialTimes
    val population: Population

    var generation: Int
        private set
    private var evolving: Boolean

    private val numberOfSurvival: Int
    private val maxPossibleSnakeLength: Int
    private val multiThreadGames: MultiThreadGames

    init {
        val inputLayerLength = InputLayer.INPUT_LAYER_LENGTH
        val layerShapes = generateLayerShape(
            inputLayerLength,
            *hiddenLayersLength.toIntArray(),
            SnakeBrain.OUTPUT_LAYER_LENGTH
        )

        if (options.providedInfo != null) {
            val (generation, snakeBrains) = options.providedInfo
            if (populationSize != snakeBrains.size) throw Error("Provided snake brains length not equal to population size.")
            this.generation = generation
            population = snakeBrains.map { x ->
                Individual(
                    snakeGame = SnakeGame(
                        options = com.example.snake.game.Options(
                            worldWidth = worldWidth,
                            worldHeight = worldHeight,
                            providedInitialStatus = null,
                        )
                    ),
                    snakeBrain = SnakeBrain(
                        options = com.example.snake.ai.Options(
                            inputLength = x.inputLength,
                            layerShapes = x.layerShapes,
                            hiddenLayerActivationFunction = x.hiddenLayerActivationFunction,
                            providedWeightsAndBiases = ProvidedWeightsAndBiases(x.weights, x.biases)
                        ),
                    ),
                    fitness = 0.0,
                    snakeLength = 1.0,
                    moves = 0.0,
                    survive = true,
                    gameRecord = null
                )
            }.toMutableList()
        } else {
            generation = -1
            population = MutableList(populationSize) {
                Individual(
                    snakeGame = SnakeGame(
                        options = com.example.snake.game.Options(
                            worldWidth = worldWidth,
                            worldHeight = worldHeight,
                            providedInitialStatus = null,
                        )
                    ),
                    snakeBrain = SnakeBrain(
                        com.example.snake.ai.Options(
                            inputLength = inputLayerLength,
                            layerShapes = layerShapes,
                            hiddenLayerActivationFunction = hiddenLayerActivationFunction,
                            providedWeightsAndBiases = null
                        )
                    ),
                    fitness = 0.0,
                    snakeLength = 1.0,
                    moves = 0.0,
                    survive = true,
                    gameRecord = null
                )
            }
        }

        evolving = false
        multiThreadGames = MultiThreadGames()
        numberOfSurvival = (populationSize * surviveRate).toInt()
        if (numberOfSurvival < 2) throw Error("Survival less than 2, please increase survive rate or population size.")
        maxPossibleSnakeLength = worldHeight * worldWidth
    }

    fun exportModel(): GaModelData = GaModelData(
        worldWidth = worldWidth,
        worldHeight = worldHeight,
        hiddenLayersLength = hiddenLayersLength,
        hiddenLayerActivationFunction = hiddenLayerActivationFunction,
        populationSize = populationSize,
        surviveRate = surviveRate,
        populationMutationRate = populationMutationRate,
        geneMutationRate = geneMutationRate,
        mutationAmount = mutationAmount,
        trialTimes = trialTimes,
        generation = generation,
        population = population.map { individual ->
            IndividualPlainObject(
                snakeBrain = individual.snakeBrain.toPlainObject(),
                fitness = individual.fitness,
                snakeLength = individual.snakeLength,
                moves = individual.moves,
                survive = individual.survive,
                gameRecord = individual.gameRecord?.let { SnakeGame.cloneGameRecord(it) }
            )
        }
    )

    suspend fun evolve(): EvolveResult {
        if (evolving) throw Error("Evolve is still running.")

        generation++
        evolving = true
        val startTime = System.currentTimeMillis()

        evaluate()
        select()
        crossover()
        mutate()

        val finalBestPlayer = population.first()

        val bestIndividual = IndividualPlainObject(
            snakeBrain = finalBestPlayer.snakeBrain.toPlainObject(),
            fitness = finalBestPlayer.fitness,
            snakeLength = finalBestPlayer.snakeLength,
            moves = finalBestPlayer.moves,
            survive = finalBestPlayer.survive,
            gameRecord = finalBestPlayer.gameRecord?.let { SnakeGame.cloneGameRecord(it) }
        )

        val overallStats = OverallStats(
            fitness = CalcUtils.statsOfArray(population.map { it.fitness }.toDoubleArray()),
            snakeLength = CalcUtils.statsOfArray(population.map { it.snakeLength }.toDoubleArray()),
            moves = CalcUtils.statsOfArray(population.map { it.moves }.toDoubleArray())
        )

        val timeSpent = System.currentTimeMillis() - startTime
        evolving = false

        return EvolveResult(
            generation,
            bestIndividual,
            timeSpent,
            overallStats
        )
    }

    private suspend fun evaluate() {
        val results = multiThreadGames.playManyGames(
            trialTimes,
            population.map { Pair(it.snakeGame, it.snakeBrain) }
        )

        for (i in population.indices) {
            val individual = population[i]
            val (snakeLengthArr, movesArr, gameRecordArr) = results[i]
            val fitnessArr = Array(trialTimes) { fitness(movesArr[it], snakeLengthArr[it], maxPossibleSnakeLength) }

            individual.snakeLength = CalcUtils.meanOfArray(snakeLengthArr.map { it.toDouble() }.toDoubleArray())
            individual.moves = CalcUtils.meanOfArray(movesArr.map { it.toDouble() }.toDoubleArray())
            individual.fitness = CalcUtils.meanOfArray(fitnessArr.map { it }.toDoubleArray())
            individual.gameRecord =
                gameRecordArr[CalcUtils.indexOfMaxValueInArray(fitnessArr.map { it }.toDoubleArray())]
        }
    }

    private fun select() {
        // sort descending (highest fitness first)
        population.sortByDescending { it.fitness }
        population.forEachIndexed { index, individual -> individual.survive = index < numberOfSurvival }
    }

    private fun crossover() {
        val prefixSum = calculateCumulativeSum(population.map { it.fitness })

        for (i in numberOfSurvival..<populationSize) {
            val parent1 = spinRouletteWheel(population, prefixSum)
            val parent2 = spinRouletteWheel(population, prefixSum)
            population[i].snakeBrain.crossOver(parent1.snakeBrain, parent2.snakeBrain)
        }
    }

    private fun mutate() {
        val best5PercentIndex = (populationSize * 0.05).toInt()

        // e.g. assume populationMutationRate be 0.5, population size be 100, target mutation is 50
        // protect the best 5% from mutating -> 95 * 0.5 / 0.95 = 50
        // the formula is
        // ((p * 0.95) * x) / p = r
        // x = r / 0.95
        // where p is population size, x is population mutation rate, r is target mutation rate
        val mutationRateForRand = populationMutationRate / 0.95

        // prevent the best 5% from mutating
        for (i in best5PercentIndex..<populationSize) {
            if (CalcUtils.randomBool(mutationRateForRand)) {
                population[i].snakeBrain.mutate(geneMutationRate, mutationAmount)
            }
        }
    }
}
