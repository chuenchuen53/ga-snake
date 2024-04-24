package com.example.spring.service

import com.example.snake.ai.ActivationFunction
import com.example.spring.request.InitModelRequest
import com.example.spring.response.shared.ModelInfo
import org.springframework.stereotype.Service

@Service
class TrainingServiceImpl : TrainingService {
    override var currentModelId: String? = null

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
}