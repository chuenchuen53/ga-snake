package com.example.spring.entity

import com.example.snake.ai.ActivationFunction
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.util.*

@Document(collection = "gamodels")
data class GaModelEntity(
    @Id
    val id: ObjectId,
    val worldWidth: Int,
    val worldHeight: Int,
    val hiddenLayersLength: List<Int>,
    val hiddenLayerActivationFunction: ActivationFunction,
    val populationSize: Int,
    val surviveRate: Double,
    val populationMutationRate: Double,
    val geneMutationRate: Double,
    val mutationAmount: Double,
    val trialTimes: Int,
    val generation: Int,
    val populationHistory: List<ObjectId>,
    val evolveResultHistory: List<ObjectId>,
    val createdAt: Date,
    val updatedAt: Date,
)