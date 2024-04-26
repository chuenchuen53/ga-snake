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

    fun resumeModel(modelId: String, generation: Int)
    
    fun evolve(times: Int)

    fun stopEvolve()

    fun toggleBackupPopulationWhenFinish(backup: Boolean)

    /**
     * Backs up the current population.
     *
     * @param skipQueueTrainingCheck If true, the check for queue training is skipped.
     * @return true if backup is successful, false if backup already exists.
     */
    fun backupCurrentPopulation(skipQueueTrainingCheck: Boolean): Boolean

    fun getCurrentModelInfo(): ModelInfo

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