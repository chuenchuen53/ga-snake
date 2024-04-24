package com.example.spring.controller

import com.example.spring.exception.BadRequestException
import com.example.spring.request.InitModelRequest
import com.example.spring.request.ResumeModelRequest
import com.example.spring.response.InitModelResponse
import com.example.spring.response.ResumeModelResponse
import com.example.spring.service.TrainingService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/training")
class TrainingController(
    @Autowired
    private val trainingService: TrainingService,
) {

    @PostMapping("/init-model")
    fun initModel(@Validated @RequestBody req: InitModelRequest): InitModelResponse {
        if (trainingService.currentModelId != null) {
            throw BadRequestException("model already exists")
        }

        val options = req.options
        trainingService.initModel(options)
        val currentModelInfo = trainingService.getCurrentModelInfo()
        return InitModelResponse(currentModelInfo)
    }

    @PostMapping("/resume-model")
    fun resumeModel(@Validated @RequestBody req: ResumeModelRequest): ResumeModelResponse {
        if (trainingService.currentModelId != null) {
            throw BadRequestException("model already exists")
        }
        val (modelId, generation) = req
        trainingService.resumeModel(modelId, generation)
        val currentModelInfo = trainingService.getCurrentModelInfo()
        return ResumeModelResponse(currentModelInfo)
    }

    @PostMapping("/evolve")
    fun evolve() {
        // implementation here
    }

    @PostMapping("/stop-evolve")
    fun stopEvolve() {
        // implementation here
    }

    @PostMapping("/backup-current-population")
    fun backupCurrentPopulation() {
        // implementation here
    }

    @PutMapping("/toggle-backup-population-when-finish")
    fun toggleBackupPopulationWhenFinish() {
        // implementation here
    }

    @GetMapping("/current-model-info")
    fun getCurrentModelInfo(): String {
        // implementation here
        return "Model Info"
    }

    @DeleteMapping("/current-model")
    fun removeCurrentModel() {
        // implementation here
    }

    @GetMapping("/polling-info/{currentEvolvingResultHistoryGeneration}/{currentPopulationHistoryGeneration}/{currentBackupPopulationInProgress}/{currentBackupPopulationWhenFinish}/{currentEvolving}")
    fun pollingInfo(
        @PathVariable currentEvolvingResultHistoryGeneration: Int,
        @PathVariable currentPopulationHistoryGeneration: Int,
        @PathVariable currentBackupPopulationInProgress: Boolean,
        @PathVariable currentBackupPopulationWhenFinish: Boolean,
        @PathVariable currentEvolving: Boolean
    ): String {
        // implementation here
        return "Polling Info"
    }
}