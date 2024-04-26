package com.example.spring.repo

import com.example.snake.ai.ga.Individual
import com.example.spring.entity.IndividualEntity
import com.example.spring.entity.PopulationEntity
import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.MongoRepository
import java.util.*

interface PopulationRepo : MongoRepository<PopulationEntity, ObjectId> {
    fun findOneByIdInAndGeneration(ids: List<ObjectId>, generation: Int): PopulationEntity?
}


fun PopulationRepo.insertNewPopulation(
    individualRepo: IndividualRepo,
    generation: Int,
    population: List<Individual>
): PopulationEntity {
    val now = Date()
    val individualEntities = individualRepo.saveAll(population.map {
        IndividualEntity(
            id = ObjectId(),
            snakeBrain = it.snakeBrain.toPlainObject(),
            snakeLength = it.snakeLength,
            moves = it.moves,
            fitness = it.fitness,
            survive = it.survive,
            gameRecord = it.gameRecord,
            createdAt = now,
            updatedAt = now
        )
    })
    val ids = individualEntities.map { it.id }
    return this.save(
        PopulationEntity(
            id = ObjectId(),
            generation = generation,
            population = ids,
            createdAt = now,
            updatedAt = now,
        )
    )
}
