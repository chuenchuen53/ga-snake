package com.example.spring.utils.event

class EventEmitter {
    private val listeners = mutableListOf<EventListener>()

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