package com.example.spring.utils.event

import kotlinx.coroutines.*

class OnceEventListener(
    private val emitter: EventEmitter,
    private val timeout: Long,
    private val onEventAction: () -> Unit,
) : EventListener, CoroutineScope {
    private val job = Job()
    override val coroutineContext = Dispatchers.Default + job

    init {
        emitter.addListener(this)
        val self = this
        launch {
            delay(timeout)
            onEventAction()
            emitter.removeListener(self)
        }
    }

    override fun onEvent() {
        job.cancel()
        onEventAction()
        emitter.removeListener(this)
    }
}