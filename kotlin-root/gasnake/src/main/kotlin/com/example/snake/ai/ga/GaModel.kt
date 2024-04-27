package com.example.snake.ai.ga

import com.example.snake.ai.ActivationFunction
import com.example.snake.ai.InputLayer
import com.example.snake.ai.ProvidedWeightsAndBiases
import com.example.snake.ai.SnakeBrain
import com.example.snake.game.SnakeGame
import com.example.snake.utils.CalcUtils
import kotlin.math.pow

class GaModel(options: Options) {
    companion object {
        fun generateLayerShape(vararg args: Int): List<List<Int>> {
            val shapes = mutableListOf<List<Int>>()
            for (i in 0 until args.size - 1) {
                shapes.add(listOf(args[i + 1], args[i]))
            }
            return shapes
        }

        fun fitness(moves: Int, snakeLength: Int, maxPossibleSnakeLength: Int): Double {
            if (snakeLength == 1) return 0.0

            val ratioOfLength = snakeLength.toDouble() / maxPossibleSnakeLength

            // for short snake
            val moveScore = moves * 10
            val cyclicPenalty = moves * 6 * (1 - ratioOfLength).pow(2)

            // for long snake
            val lengthScore = (snakeLength - 1).toDouble()
                .pow(2 + 6 * ratioOfLength) * maxPossibleSnakeLength * moves

            return moveScore - cyclicPenalty + lengthScore
        }

        fun spinRouletteWheel(options: List<Individual>): Individual {
            val totalScore = options.sumOf { it.fitness }
            var randomNum = Math.random() * totalScore
            for (option in options) {
                if (randomNum < option.fitness) {
                    return option
                }
                randomNum -= option.fitness
            }
            return options.last()
        }
    }

    val worldWidth: Int
    val worldHeight: Int
    val hiddenLayersLength: List<Int>
    val hiddenLayerActivationFunction: ActivationFunction
    val populationSize: Int
    val surviveRate: Double
    val populationMutationRate: Double
    val geneMutationRate: Double
    val mutationAmount: Double
    val trialTimes: Int
    val population: Population

    private var _generation: Int
    private var _evolving: Boolean
    private val _numberOfSurvival: Int
    private val _maxPossibleSnakeLength: Int
    private val multiThreadGames: com.example.snake.ai.multithread.MultiThreadGames

    val generation: Int
        get() = _generation
    val evolving: Boolean
        get() = _evolving

    init {
        worldHeight = options.worldHeight
        worldWidth = options.worldWidth
        hiddenLayersLength = options.snakeBrainConfig.hiddenLayersLength
        hiddenLayerActivationFunction = options.snakeBrainConfig.hiddenLayerActivationFunction
        populationSize = options.gaConfig.populationSize
        surviveRate = options.gaConfig.surviveRate
        populationMutationRate = options.gaConfig.populationMutationRate
        geneMutationRate = options.gaConfig.geneMutationRate
        mutationAmount = options.gaConfig.mutationAmount
        trialTimes = options.gaConfig.trialTimes

        val inputLayerLength = InputLayer.INPUT_LAYER_LENGTH
        val layerShapes = GaModel.generateLayerShape(
            inputLayerLength,
            *hiddenLayersLength.toIntArray(),
            SnakeBrain.OUTPUT_LAYER_LENGTH
        )

        if (options.providedInfo != null) {
            val (generation, snakeBrains) = options.providedInfo
            if (populationSize != snakeBrains.size) throw Error("Provided snake brains length not equal to population size.")
            _generation = generation
            population = snakeBrains.map { x ->
                Individual(
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
            _generation = -1
            population = List(populationSize) {
                Individual(
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
            }.toMutableList()
        }

        _evolving = false
        multiThreadGames = com.example.snake.ai.multithread.MultiThreadGames()
        _numberOfSurvival = (populationSize * surviveRate).toInt()
        if (_numberOfSurvival < 2) throw Error("Survival less than 2, please increase survive rate or population size.")
        _maxPossibleSnakeLength = worldHeight * worldWidth
    }

    fun exportModel(): com.example.snake.ai.ga.GaModelData = com.example.snake.ai.ga.GaModelData(
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
        if (_evolving) throw Error("Evolve is still running.")

        _generation++
        _evolving = true
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

        val overallStats = com.example.snake.ai.ga.OverallStats(
            fitness = CalcUtils.statsOfArray(population.map { it.fitness }.toDoubleArray()),
            snakeLength = CalcUtils.statsOfArray(population.map { it.snakeLength }.toDoubleArray()),
            moves = CalcUtils.statsOfArray(population.map { it.moves }.toDoubleArray())
        )

        val timeSpent = (System.currentTimeMillis() - startTime).toDouble()
        _evolving = false

        return EvolveResult(
            generation,
            bestIndividual,
            timeSpent,
            overallStats
        )
    }

    private suspend fun evaluate() {
        val results = multiThreadGames.playManyGames(
            worldWidth,
            worldHeight,
            trialTimes,
            population.map { it.snakeBrain })

        for (i in population.indices) {
            val individual = population[i]
            val (snakeLengthArr, movesArr, gameRecordArr) = results[i]
            val fitnessArr =
                Array(trialTimes) {
                    fitness(
                        movesArr[it],
                        snakeLengthArr[it],
                        _maxPossibleSnakeLength
                    )
                }

            individual.snakeLength =
                CalcUtils.meanOfArray(snakeLengthArr.map { it.toDouble() }.toDoubleArray())
            individual.moves = CalcUtils.meanOfArray(movesArr.map { it.toDouble() }.toDoubleArray())
            individual.fitness = CalcUtils.meanOfArray(fitnessArr.map { it }.toDoubleArray())
            individual.gameRecord =
                gameRecordArr[CalcUtils.indexOfMaxValueInArray(fitnessArr.map { it }
                    .toDoubleArray())]
        }
    }

    private fun select() {
        // sort descending (highest fitness first)
        population.sortByDescending { it.fitness }
        population.forEachIndexed { index, individual ->
            individual.survive = index < _numberOfSurvival
        }
    }

    private fun crossover() {
        population.forEach {
            if (it.survive) return@forEach

            val parent1 = pickParent(it)
            val parent2 = pickParent(it, parent1)
            it.snakeBrain.crossOver(parent1.snakeBrain, parent2.snakeBrain)
        }
    }

    private fun pickParent(child: Individual, anotherParent: Individual? = null): Individual {
        val filteredPopulation = population.filter { it !== child && it !== anotherParent }
        return spinRouletteWheel(filteredPopulation)
    }

    private fun mutate() {
        val best5PercentIndex = (_numberOfSurvival * 0.05).toInt()

        // e.g. assume populationMutationRate be 0.5, population size be 100, target mutation is 50
        // protect the best 5% from mutating -> 95 * 0.5 / 0.95 = 50
        // the formula is
        // ((p * 0.95) * x) / p = r
        // x = r / 0.95
        // where p is population size, x is population mutation rate, r is target mutation rate
        val mutationRateForRand = populationMutationRate / 0.95

        population.forEachIndexed { index, individual ->
            // prevent the best 5% from mutating
            if (index < best5PercentIndex) return@forEachIndexed

            if (CalcUtils.randomBool(mutationRateForRand)) {
                individual.snakeBrain.mutate(geneMutationRate, mutationAmount)
            }
        }
    }
}
