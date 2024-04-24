package com.example.spring.exception

class BadRequestException(override val message: String) : RuntimeException(message)