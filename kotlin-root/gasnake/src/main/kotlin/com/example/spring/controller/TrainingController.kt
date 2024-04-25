package com.example.spring.controller

import com.example.spring.exception.BadRequestException
import com.example.spring.request.EvolveRequest
import com.example.spring.request.InitModelRequest
import com.example.spring.request.ResumeModelRequest
import com.example.spring.request.ToggleBackupPopulationWhenFinishRequest
import com.example.spring.response.GetCurrentModelInfoResponse
import com.example.spring.response.InitModelResponse
import com.example.spring.response.PollingInfoResponse
import com.example.spring.response.ResumeModelResponse
import com.example.spring.service.TrainingService
import com.example.spring.utils.event.OnceEventListener
import kotlinx.coroutines.CompletableDeferred
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/training")
class TrainingController(
    @Autowired
    private val service: TrainingService,
) {
    companion object {
        const val pollingTimeOut = 30000L
    }

    @PostMapping("/init-model")
    fun initModel(@Validated @RequestBody req: InitModelRequest): InitModelResponse {
        if (service.currentModelId != null) {
            throw BadRequestException("model already exists")
        }

        val options = req.options
        service.initModel(options)
        val currentModelInfo = service.getCurrentModelInfo()
        return InitModelResponse(currentModelInfo)
    }

    @PostMapping("/resume-model")
    fun resumeModel(@Validated @RequestBody req: ResumeModelRequest): ResumeModelResponse {
        if (service.currentModelId != null) {
            throw BadRequestException("model already exists")
        }
        val (modelId, generation) = req
        service.resumeModel(modelId, generation)
        val currentModelInfo = service.getCurrentModelInfo()
        return ResumeModelResponse(currentModelInfo)
    }

    @PostMapping("/evolve")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun evolve(@Validated @RequestBody req: EvolveRequest) {
        haveModelGuard()

        if (service.queueTraining != 0) {
            throw BadRequestException("training already started")
        }
        val times = req.times
        service.evolve(times)
    }

    @PostMapping("/stop-evolve")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun stopEvolve() {
        service.stopEvolve()
    }

    @PutMapping("/toggle-backup-population-when-finish")
    fun toggleBackupPopulationWhenFinish(@Validated @RequestBody req: ToggleBackupPopulationWhenFinishRequest) {
        val backup = req.backup
        service.toggleBackupPopulationWhenFinish(backup)
    }

    @PostMapping("/backup-current-population")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun backupCurrentPopulation() {
        haveModelGuard()

        if (this.service.backupPopulationInProgress) {
            throw BadRequestException("previous backup still in progress")
        }

        val result = service.backupCurrentPopulation(false)
        if (!result) {
            throw BadRequestException("population already backup")
        }
    }

    @GetMapping("/current-model-info")
    fun getCurrentModelInfo(): GetCurrentModelInfoResponse {
        if (service.currentModelId == null) {
            return GetCurrentModelInfoResponse(null)
        }

        val currentModelInfo = service.getCurrentModelInfo()
        return GetCurrentModelInfoResponse(currentModelInfo)
    }

    @DeleteMapping("/current-model")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun removeCurrentModel() {
        haveModelGuard()

        service.removeCurrentModel()
    }

    @GetMapping("/polling-info/{currentEvolvingResultHistoryGeneration}/{currentPopulationHistoryGeneration}/{currentBackupPopulationInProgress}/{currentBackupPopulationWhenFinish}/{currentEvolving}")
    suspend fun pollingInfo(
        @PathVariable currentEvolvingResultHistoryGeneration: Int,
        @PathVariable currentPopulationHistoryGeneration: Int,
        @PathVariable currentBackupPopulationInProgress: Boolean,
        @PathVariable currentBackupPopulationWhenFinish: Boolean,
        @PathVariable currentEvolving: Boolean
    ): PollingInfoResponse {
        val stateMatch = service.stateMatch(
            evolvingResultHistoryGeneration = currentEvolvingResultHistoryGeneration,
            populationHistoryGeneration = currentPopulationHistoryGeneration,
            backupPopulationInProgress = currentBackupPopulationInProgress,
            backupPopulationWhenFinish = currentBackupPopulationWhenFinish,
            evolving = currentEvolving,
        )

        if (!stateMatch) {
            val info = service.pollingInfo(
                currentEvolvingResultHistoryGeneration = currentEvolvingResultHistoryGeneration,
                currentPopulationHistoryGeneration = currentPopulationHistoryGeneration,
            )
            return info
        }

        val deferred = CompletableDeferred<PollingInfoResponse>()

        OnceEventListener(service.emitter, pollingTimeOut) {
            val info = service.pollingInfo(
                currentEvolvingResultHistoryGeneration,
                currentPopulationHistoryGeneration
            )
            deferred.complete(info)
        }

        return deferred.await()
    }

    private fun haveModelGuard() {
        if (service.currentModelId == null) {
            throw BadRequestException("model not exists")
        }
    }
}