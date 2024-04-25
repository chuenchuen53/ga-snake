package com.example.spring.repo

import com.example.spring.entity.GaModelEntity
import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.MongoRepository

interface GaModelRepo : MongoRepository<GaModelEntity, ObjectId> {
}