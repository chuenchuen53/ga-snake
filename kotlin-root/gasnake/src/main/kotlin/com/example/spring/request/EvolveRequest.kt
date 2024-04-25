package com.example.spring.request

import jakarta.validation.constraints.Min

data class EvolveRequest(
    @Min(1)
    val times: Int
)