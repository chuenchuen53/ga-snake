package com.example.spring.repo

import com.example.spring.entity.EvolveResultEntity
import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.MongoRepository

interface EvolveResultRepo : MongoRepository<EvolveResultEntity, ObjectId> {
}