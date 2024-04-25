package com.example.spring.entity

import com.example.snake.ai.ga.IndividualPlainObject
import com.example.snake.ai.ga.OverallStats
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.util.*

@Document(collection = "evolveresults")
data class EvolveResultEntity(
    @Id
    val id: ObjectId,
    val generation: Int,
    val bestIndividual: IndividualPlainObject,
    val timeSpent: Long,
    val overallStats: OverallStats,
    val createdAt: Date,
    val updatedAt: Date,
)

