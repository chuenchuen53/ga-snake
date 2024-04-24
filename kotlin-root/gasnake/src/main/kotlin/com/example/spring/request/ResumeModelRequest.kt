package com.example.spring.request

import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank

data class ResumeModelRequest(
    @NotBlank
    val modelId: String,

    @Min(1)
    val generation: Int
)
