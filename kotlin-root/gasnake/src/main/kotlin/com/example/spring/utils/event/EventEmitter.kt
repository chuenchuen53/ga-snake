package com.example.spring.utils.event

import java.util.concurrent.CopyOnWriteArrayList

class EventEmitter {
    private val listeners = CopyOnWriteArrayList<EventListener>()

    fun addListener(listener: EventListener) {
        listeners.add(listener)
    }

    fun removeListener(listener: EventListener) {
        listeners.remove(listener)
    }

    fun emit() {
        listeners.forEach { it.onEvent() }
    }
}