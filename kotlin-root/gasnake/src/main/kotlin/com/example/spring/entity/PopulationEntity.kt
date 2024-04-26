package com.example.spring.entity

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.util.*

@Document(collection = "populations")
data class PopulationEntity(
    @Id
    val id: ObjectId,
    val generation: Int,
    val population: List<ObjectId>,
    val createdAt: Date,
    val updatedAt: Date,
)
