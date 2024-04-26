package com.example.spring.entity

import com.example.snake.ai.SnakeBrainData
import com.example.snake.game.GameRecord
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.util.*

@Document(collection = "individuals")
data class IndividualEntity(
    @Id
    val id: ObjectId,
    val snakeBrain: SnakeBrainData,
    val snakeLength: Double,
    val moves: Double,
    val fitness: Double,
    val survive: Boolean,
    val gameRecord: GameRecord? = null,
    val createdAt: Date,
    val updatedAt: Date,
)
