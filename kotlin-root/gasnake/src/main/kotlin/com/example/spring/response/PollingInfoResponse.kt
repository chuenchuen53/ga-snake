package com.example.spring.response

import com.example.spring.response.shared.EvolveResultWithId
import com.example.spring.response.shared.PopulationHistory

data class PollingInfoResponse(
    val newEvolveResultHistory: List<EvolveResultWithId>,
    val newPopulationHistory: List<PopulationHistory>,
    val backupPopulationInProgress: Boolean,
    val backupPopulationWhenFinish: Boolean,
    val evolving: Boolean
)