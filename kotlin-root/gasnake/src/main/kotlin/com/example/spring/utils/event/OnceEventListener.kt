package com.example.spring.utils.event

import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class OnceEventListener(
    private val emitter: EventEmitter,
    private val timeout: Long,
    private val onEventAction: () -> Unit,
) : EventListener {
    private val job: Job

    init {
        emitter.addListener(this)
        job = GlobalScope.launch {
            delay(timeout)
            onEvent()
        }
    }

    override fun onEvent() {
        job.cancel() // todo test bug
        onEventAction()
        emitter.removeListener(this)
    }
}