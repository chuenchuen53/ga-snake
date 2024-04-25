package com.example.spring.service

import com.example.snake.ai.ActivationFunction
import com.example.spring.request.InitModelRequest
import com.example.spring.response.PollingInfoResponse
import com.example.spring.response.shared.ModelInfo
import com.example.spring.utils.event.EventEmitter
import org.springframework.stereotype.Service

@Service
class TrainingServiceImpl() : TrainingService {
    override var currentModelId: String? = null
    override var queueTraining: Int = 0
    override var backupPopulationInProgress: Boolean = false
    override var emitter: EventEmitter = EventEmitter()
    
    override fun initModel(options: InitModelRequest.Options) {
        currentModelId = "testing_id"
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

    override fun resumeModel(modelId: String, generation: Int): ModelInfo {
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
        TODO("Not yet implemented")
    }

    override fun stopEvolve() {
        TODO("Not yet implemented")
    }

    override fun toggleBackupPopulationWhenFinish(backup: Boolean) {
        TODO("Not yet implemented")
    }

    override fun backupCurrentPopulation(): Boolean {
        TODO("Not yet implemented")
    }

    override fun removeCurrentModel() {
        TODO("Not yet implemented")
    }

    override fun stateMatch(
        evolvingResultHistoryGeneration: Int,
        populationHistoryGeneration: Int,
        backupPopulationInProgress: Boolean,
        backupPopulationWhenFinish: Boolean,
        evolving: Boolean
    ): Boolean {
        TODO("Not yet implemented")
    }

    override fun pollingInfo(
        currentEvolvingResultHistoryGeneration: Int,
        currentPopulationHistoryGeneration: Int
    ): PollingInfoResponse {
        TODO("Not yet implemented")
    }
}