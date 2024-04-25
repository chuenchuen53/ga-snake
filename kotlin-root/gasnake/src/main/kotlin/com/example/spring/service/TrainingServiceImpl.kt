package com.example.spring.service

import com.example.snake.ai.ActivationFunction
import com.example.snake.ai.ga.GaConfig
import com.example.snake.ai.ga.GaModel
import com.example.snake.ai.ga.Options
import com.example.snake.ai.ga.SnakeBrainConfig
import com.example.spring.entity.EvolveResultEntity
import com.example.spring.entity.GaModelEntity
import com.example.spring.exception.BadRequestException
import com.example.spring.repo.EvolveResultRepo
import com.example.spring.repo.GaModelRepo
import com.example.spring.request.InitModelRequest
import com.example.spring.response.PollingInfoResponse
import com.example.spring.response.shared.EvolveResultWithId
import com.example.spring.response.shared.ModelInfo
import com.example.spring.response.shared.PopulationHistory
import com.example.spring.utils.event.EventEmitter
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Criteria
import org.springframework.data.mongodb.core.query.Query
import org.springframework.data.mongodb.core.query.Update
import org.springframework.stereotype.Service

@Service
class TrainingServiceImpl() : TrainingService {
    @Autowired
    private lateinit var gaModelRepo: GaModelRepo

    @Autowired
    private lateinit var evolveResultRepo: EvolveResultRepo

    @Autowired
    private lateinit var mongoTemplate: MongoTemplate

    val trainingScope = CoroutineScope(Dispatchers.Default)

    override var currentModelId: String? = null

    override var emitter: EventEmitter = EventEmitter()
    override var queueTraining: Int = 0
    override var backupPopulationInProgress: Boolean = false
    private var evolveResultHistoryCache: MutableList<EvolveResultWithId> = mutableListOf()
    private var backupPopulationWhenFinish: Boolean = false
    private var populationHistoryCache: MutableList<PopulationHistory> = mutableListOf()
    private var worker: GaModel? = null
    private var modelEvolving = false

    private fun publishChange() {
        emitter.emit()
    }

    override fun initModel(options: InitModelRequest.Options) {
        val model = GaModel(
            options = Options(
                worldWidth = options.worldWidth,
                worldHeight = options.worldHeight,
                snakeBrainConfig = SnakeBrainConfig(
                    options.snakeBrainConfig.hiddenLayersLength,
                    options.snakeBrainConfig.hiddenLayerActivationFunction
                ),
                gaConfig = GaConfig(
                    options.gaConfig.populationSize,
                    options.gaConfig.surviveRate,
                    options.gaConfig.populationMutationRate,
                    options.gaConfig.geneMutationRate,
                    options.gaConfig.mutationAmount,
                    options.gaConfig.trialTimes
                )
            )
        )

        val modelData = model.exportModel()
        val now = java.util.Date()
        val entity = GaModelEntity(
            id = ObjectId(),
            worldWidth = modelData.worldWidth,
            worldHeight = modelData.worldHeight,
            hiddenLayersLength = modelData.hiddenLayersLength,
            hiddenLayerActivationFunction = modelData.hiddenLayerActivationFunction,
            populationSize = modelData.populationSize,
            surviveRate = modelData.surviveRate,
            populationMutationRate = modelData.populationMutationRate,
            geneMutationRate = modelData.geneMutationRate,
            mutationAmount = modelData.mutationAmount,
            trialTimes = modelData.trialTimes,
            generation = modelData.generation,
            populationHistory = emptyList(),
            evolveResultHistory = emptyList(),
            createdAt = now,
            updatedAt = now,
        )

        val saveEntity = gaModelRepo.save(entity)

        currentModelId = saveEntity.id.toString()
        worker = model
    }


    override fun resumeModel(modelId: String, generation: Int): ModelInfo {
        // todo
        return ModelInfo(
            "testing_id",
            10,
            10,
            listOf(10, 10),
            ActivationFunction.RELU,
            5000,
            0.5,
            0.2,
            0.5,
            0.2,
            1,
            1,
            emptyList(),
            emptyList()
        )
    }

    override fun evolve(times: Int) {
        if (currentModelId == null) throw BadRequestException("model does not exists")
        if (queueTraining > 0) throw BadRequestException("training already started")
        queueTraining = times
        trainingScope.launch { startTraining() }
    }

    override fun stopEvolve() {
        queueTraining = 0
    }

    override fun toggleBackupPopulationWhenFinish(backup: Boolean) {
        backupPopulationWhenFinish = backup
    }

    override fun backupCurrentPopulation(skipQueueTrainingCheck: Boolean): Boolean {
        // todo
        return false
    }

    override fun getCurrentModelInfo(): ModelInfo {
        return ModelInfo(
            "testing_id",
            10,
            10,
            listOf(10, 10),
            ActivationFunction.RELU,
            5000,
            0.5,
            0.2,
            0.5,
            0.2,
            1,
            1,
            emptyList(),
            emptyList()
        )
    }

    override fun removeCurrentModel() {
        //todo
//        if (modelEvolving)
//         if(backupPopulationInProgress)

        if (currentModelId != null) {
            currentModelId = null
            worker = null
            queueTraining = 0
            backupPopulationInProgress = false
            evolveResultHistoryCache.clear()
            populationHistoryCache.clear()
        }
    }

    override fun stateMatch(
        evolvingResultHistoryGeneration: Int,
        populationHistoryGeneration: Int,
        backupPopulationInProgress: Boolean,
        backupPopulationWhenFinish: Boolean,
        evolving: Boolean
    ): Boolean {
        if (currentModelId == null) throw BadRequestException("model does not exists")
        val haveNewEvolveResultHistory = (evolveResultHistoryCache.lastOrNull()?.generation
            ?: -1) > evolvingResultHistoryGeneration
        val haveNewPopulationHistory =
            (populationHistoryCache.lastOrNull()?.generation ?: -1) > populationHistoryGeneration
        val backupPopulationInProgressMatch =
            this.backupPopulationInProgress == backupPopulationInProgress
        val backupPopulationWhenFinishMatch =
            this.backupPopulationWhenFinish == backupPopulationWhenFinish
        val evolvingMatch = ((queueTraining != 0) || modelEvolving) == evolving
        return !haveNewEvolveResultHistory && !haveNewPopulationHistory && backupPopulationInProgressMatch && backupPopulationWhenFinishMatch && evolvingMatch
    }

    override fun pollingInfo(
        currentEvolvingResultHistoryGeneration: Int,
        currentPopulationHistoryGeneration: Int
    ): PollingInfoResponse {
        if (currentModelId == null) throw BadRequestException("model does not exists")

        val newEvolveResultHistory =
            evolveResultHistoryCache.filter { it.generation > currentEvolvingResultHistoryGeneration }
        val newPopulationHistory =
            populationHistoryCache.filter { it.generation > currentPopulationHistoryGeneration }

        return PollingInfoResponse(
            newEvolveResultHistory,
            newPopulationHistory,
            backupPopulationInProgress,
            backupPopulationWhenFinish,
            queueTraining != 0 || modelEvolving
        )
    }

    private suspend fun startTraining() {
        worker?.let { localWorker ->
            if (currentModelId == null || queueTraining == 0) return
            modelEvolving = true
            val evolveResult = localWorker.evolve()
            modelEvolving = false
            if (queueTraining > 0) queueTraining--

            val now = java.util.Date()
            val entity = EvolveResultEntity(
                id = ObjectId(),
                generation = evolveResult.generation,
                bestIndividual = evolveResult.bestIndividual,
                timeSpent = evolveResult.timeSpent.toLong(), // todo
                overallStats = evolveResult.overallStats,
                createdAt = now,
                updatedAt = now,
            )
            val savedEntity = evolveResultRepo.save(entity)

            val query = Query()
            query.addCriteria(Criteria.where("id").`is`(currentModelId))
            val update = Update()
            update.set("updatedAt", now)
            update.set("generation", evolveResult.generation)
            update.push("evolveResultHistory", entity.id)
            mongoTemplate.findAndModify(query, update, GaModelEntity::class.java)

            val evolveResultWithId = EvolveResultWithId(
                savedEntity.id.toString(),
                evolveResult.generation,
                evolveResult.bestIndividual,
                evolveResult.timeSpent,
                evolveResult.overallStats
            )
            evolveResultHistoryCache.add(evolveResultWithId)
            publishChange()

            if (queueTraining > 0) {
                val maxScore = localWorker.worldWidth * localWorker.worldHeight
                if (evolveResultHistoryCache.indexOfFirst { it.bestIndividual.snakeLength.toInt() == maxScore } == (evolveResultHistoryCache.size - 1)) {
                    backupCurrentPopulation(true)
                }

                startTraining()
            } else if (queueTraining == 0 && backupPopulationWhenFinish) {
                backupCurrentPopulation(false)
            }
        }
    }
}