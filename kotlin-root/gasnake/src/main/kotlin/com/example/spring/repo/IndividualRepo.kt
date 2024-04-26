package com.example.spring.repo

import com.example.spring.entity.IndividualEntity
import org.bson.types.ObjectId
import org.springframework.data.mongodb.repository.MongoRepository

interface IndividualRepo : MongoRepository<IndividualEntity, ObjectId> {
}