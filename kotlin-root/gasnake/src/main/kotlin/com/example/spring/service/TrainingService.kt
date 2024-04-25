package com.example.spring.service

import com.example.spring.request.InitModelRequest
import com.example.spring.response.PollingInfoResponse
import com.example.spring.response.shared.ModelInfo
import com.example.spring.utils.event.EventEmitter

interface TrainingService {
    var currentModelId: String?
    var queueTraining: Int
    var backupPopulationInProgress: Boolean
    var emitter: EventEmitter

    fun initModel(options: InitModelRequest.Options)

    fun getCurrentModelInfo(): ModelInfo

    fun resumeModel(modelId: String, generation: Int): ModelInfo

    fun evolve(times: Int)

    fun stopEvolve()

    fun toggleBackupPopulationWhenFinish(backup: Boolean)

    fun backupCurrentPopulation(): Boolean

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