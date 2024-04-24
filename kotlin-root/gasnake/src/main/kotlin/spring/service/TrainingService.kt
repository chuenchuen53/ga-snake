package com.example.spring.service

import com.example.spring.request.InitModelRequest
import com.example.spring.response.InitModelResponse

interface TrainingService {
    var currentModelId: String?

    fun initModel(options: InitModelRequest.Options)

    fun getCurrentModelInfo(): InitModelResponse.ModelInfo
}