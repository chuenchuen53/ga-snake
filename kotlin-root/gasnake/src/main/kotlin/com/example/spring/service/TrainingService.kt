package com.example.spring.service

import com.example.spring.request.InitModelRequest
import com.example.spring.response.shared.ModelInfo

interface TrainingService {
    var currentModelId: String?

    fun initModel(options: InitModelRequest.Options)

    fun getCurrentModelInfo(): ModelInfo

    fun resumeModel(modelId: String, generation: Int): ModelInfo
}