package com.example.spring.service

import com.example.spring.request.InitModelRequest
import com.example.spring.response.PollingInfoResponse
import com.example.spring.response.shared.ModelInfo
import com.example.spring.utils.event.EventEmitter

interface TrainingService {
    val currentModelId: String?
    val queueTraining: Int
    val backupPopulationInProgress: Boolean
    val emitter: EventEmitter

    fun initModel(options: InitModelRequest.Options)

    fun getCurrentModelInfo(): ModelInfo

    fun resumeModel(modelId: String, generation: Int)

    fun evolve(times: Int)

    fun stopEvolve()

    fun toggleBackupPopulationWhenFinish(backup: Boolean)

    fun backupCurrentPopulation(skipQueueTrainingCheck: Boolean): Boolean

    fun removeCurrentModel()

    fun stateMatch(
        evolvingResultHistoryGeneration: Int,
        populationHistoryGeneration: Int,
        backupPopulationInProgress: Boolean,
        backupPopulationWhenFinish: Boolean,
        evolving: Boolean
    ): Boolean

    fun pollingInfo(
        currentEvolvingResultHistoryGeneration: Int,
        currentPopulationHistoryGeneration: Int
    ): PollingInfoResponse
}