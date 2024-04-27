package com.example.spring.service

import com.example.snake.ai.ga.*
import com.example.spring.entity.EvolveResultEntity
import com.example.spring.entity.GaModelEntity
import com.example.spring.exception.BadRequestException
import com.example.spring.repo.*
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
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class TrainingServiceImpl : TrainingService {
    override var currentModelId: String? = null
    override var emitter: EventEmitter = EventEmitter()
    override var queueTraining: Int = 0
    override var backupPopulationInProgress: Boolean = false

    @Autowired
    private lateinit var mongoTemplate: MongoTemplate

    @Autowired
    private lateinit var gaModelRepo: GaModelRepo

    @Autowired
    private lateinit var evolveResultRepo: EvolveResultRepo

    @Autowired
    private lateinit var populationRepo: PopulationRepo

    @Autowired
    private lateinit var individualRepo: IndividualRepo

    private val trainingScope = CoroutineScope(Dispatchers.Default)

    private var evolveResultHistoryCache: MutableList<EvolveResultWithId> = mutableListOf()
    private var backupPopulationWhenFinish: Boolean = false
    private var populationHistoryCache: MutableList<PopulationHistory> = mutableListOf()
    private var serviceModel: GaModel? = null
    private var modelEvolving = false

    private fun publishChange() {
        emitter.emit()
    }

    override fun initModel(options: Options) {
        val model = GaModel(options)

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
        serviceModel = model
    }


    override fun resumeModel(modelId: String, generation: Int) {
        val gaModelEntity = gaModelRepo.findByIdOrNull(ObjectId(modelId))
            ?: throw BadRequestException("model not found")

        val populationEntity = populationRepo.findOneByIdInAndGeneration(gaModelEntity.populationHistory, generation)
            ?: throw BadRequestException("population not found")

        val individualEntities = individualRepo.findAllById(populationEntity.population)
        val snakeBrainDataList = individualEntities.map { it.snakeBrain }

        val gaOptions = Options(
            worldWidth = gaModelEntity.worldWidth,
            worldHeight = gaModelEntity.worldHeight,
            snakeBrainConfig = SnakeBrainConfig(
                gaModelEntity.hiddenLayersLength,
                gaModelEntity.hiddenLayerActivationFunction
            ),
            gaConfig = GaConfig(
                gaModelEntity.populationSize,
                gaModelEntity.surviveRate,
                gaModelEntity.populationMutationRate,
                gaModelEntity.geneMutationRate,
                gaModelEntity.mutationAmount,
                gaModelEntity.trialTimes
            ),
            providedInfo = ProvidedInfo(
                generation = generation,
                snakeBrains = snakeBrainDataList
            )
        )
        initModel(gaOptions)

        val parentModelEvolveResultEntities =
            evolveResultRepo.findAllById(gaModelEntity.evolveResultHistory)
        val newModelEvolveResultEntities = parentModelEvolveResultEntities
            .filter { it.generation <= generation }
            .map { it.copy(id = ObjectId()) }
        val insertedEvolveResultEntities = evolveResultRepo.saveAll(newModelEvolveResultEntities)
        val insertedEvolveResultIds = insertedEvolveResultEntities.map { it.id }

        val query = Query().addCriteria(Criteria.where("id").`is`(currentModelId))
        val update = Update()
            .set(GaModelEntity::updatedAt.name, java.util.Date())
            .set(GaModelEntity::evolveResultHistory.name, insertedEvolveResultIds)

        mongoTemplate.findAndModify(query, update, GaModelEntity::class.java)

        val evolveResultWithIdList = insertedEvolveResultEntities.map {
            EvolveResultWithId(
                _id = it.id.toString(),
                generation = it.generation,
                bestIndividual = it.bestIndividual,
                timeSpent = it.timeSpent,
                overallStats = it.overallStats
            )
        }
        evolveResultHistoryCache.addAll(evolveResultWithIdList)
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
        if (currentModelId == null || serviceModel == null) throw BadRequestException("model does not exists")
        if (backupPopulationInProgress) throw BadRequestException("previous backup still in progress")
        if (!skipQueueTrainingCheck && queueTraining > 0) throw BadRequestException("model is evolving") // population will change during evolving

        currentModelId?.let { nonNullCurrentModelId ->
            serviceModel?.let { model ->
                if (model.generation == -1) throw BadRequestException("model generation is -1, has not evolved yet")

                val gaModel = gaModelRepo.findByIdOrNull(ObjectId(nonNullCurrentModelId))
                    ?: throw BadRequestException("model not found")

                val populationHistory = gaModel.populationHistory
                if (populationHistory.isNotEmpty()) {
                    val lastPopulationId = populationHistory.last()
                    val lastPopulation = populationRepo.findByIdOrNull(lastPopulationId)
                        ?: throw BadRequestException("population not found")
                    if (lastPopulation.generation == model.generation) return false
                }

                backupPopulationInProgress = true

                publishChange()

                val savedEntity = populationRepo.insertNewPopulation(
                    individualRepo,
                    model.generation,
                    model.population
                )

                val query = Query().addCriteria(Criteria.where("id").`is`(nonNullCurrentModelId))
                val update = Update()
                    .set(GaModelEntity::updatedAt.name, java.util.Date())
                    .push(GaModelEntity::populationHistory.name, savedEntity.id)
                mongoTemplate.findAndModify(query, update, GaModelEntity::class.java)

                populationHistoryCache.add(PopulationHistory(savedEntity.id.toString(), model.generation))
                publishChange()

                backupPopulationInProgress = false
                return true
            }

        }

        throw Error("logic error, should not reach here")
    }

    override fun getCurrentModelInfo(): ModelInfo {
        if (currentModelId == null) throw BadRequestException("model does not exists")
        val model = gaModelRepo.findByIdOrNull(ObjectId(currentModelId))
            ?: throw BadRequestException("model not found")
        val evolveResultEntities = evolveResultRepo.findAllById(model.evolveResultHistory)
        val populationEntities = populationRepo.findAllById(model.populationHistory)

        val evolveResultWithIdList = evolveResultEntities.map {
            EvolveResultWithId(
                _id = it.id.toString(),
                generation = it.generation,
                bestIndividual = it.bestIndividual,
                timeSpent = it.timeSpent,
                overallStats = it.overallStats
            )
        }

        val populationHistory = populationEntities.map {
            PopulationHistory(
                _id = it.id.toString(),
                generation = it.generation
            )
        }

        return ModelInfo(
            _id = model.id.toString(),
            worldWidth = model.worldWidth,
            worldHeight = model.worldHeight,
            hiddenLayersLength = model.hiddenLayersLength,
            hiddenLayerActivationFunction = model.hiddenLayerActivationFunction,
            populationSize = model.populationSize,
            surviveRate = model.surviveRate,
            populationMutationRate = model.populationMutationRate,
            geneMutationRate = model.geneMutationRate,
            mutationAmount = model.mutationAmount,
            trialTimes = model.trialTimes,
            generation = model.generation,
            evolveResultHistory = evolveResultWithIdList,
            populationHistory = populationHistory,
        )
    }

    override fun removeCurrentModel() {
        if (modelEvolving) throw BadRequestException("model is evolving")
        if (backupPopulationInProgress) throw BadRequestException("backup population in progress")

        if (currentModelId != null) {
            currentModelId = null
            serviceModel = null
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
        if (currentModelId == null || queueTraining == 0) return
        currentModelId?.let { nonNullCurrentModelId ->
            serviceModel?.let { model ->
                modelEvolving = true
                val evolveResult = model.evolve()
                modelEvolving = false
                if (queueTraining > 0) queueTraining--

                val now = java.util.Date()
                val entity = EvolveResultEntity(
                    id = ObjectId(),
                    generation = evolveResult.generation,
                    bestIndividual = evolveResult.bestIndividual,
                    timeSpent = evolveResult.timeSpent,
                    overallStats = evolveResult.overallStats,
                    createdAt = now,
                    updatedAt = now,
                )
                val savedEvolveResultEntity = evolveResultRepo.save(entity)

                val query = Query().addCriteria(Criteria.where("id").`is`(nonNullCurrentModelId))
                val update = Update()
                    .set(GaModelEntity::updatedAt.name, java.util.Date())
                    .set(GaModelEntity::generation.name, evolveResult.generation)
                    .push(GaModelEntity::evolveResultHistory.name, entity.id)
                mongoTemplate.findAndModify(query, update, GaModelEntity::class.java)

                val evolveResultWithId = EvolveResultWithId(
                    savedEvolveResultEntity.id.toString(),
                    evolveResult.generation,
                    evolveResult.bestIndividual,
                    evolveResult.timeSpent,
                    evolveResult.overallStats
                )
                evolveResultHistoryCache.add(evolveResultWithId)
                publishChange()

                if (queueTraining > 0) {
                    val maxScore = model.worldWidth * model.worldHeight
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
}