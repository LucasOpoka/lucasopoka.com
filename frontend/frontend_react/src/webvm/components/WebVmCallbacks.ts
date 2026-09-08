import { getDefaultStore } from 'jotai'
import { diskStateAtom, cpuStateAtom } from '../WebVmAtoms'
import type { ActivityEvent } from '../../types/webvm'

export function createWebVmCallbacks() {
  const store = getDefaultStore()

  function expireEvents(
    list: ActivityEvent[],
    limitTime: number,
  ): ActivityEvent[] {
    const firstEvent = list[0]
    const validEvents = list.slice(1).filter((event) => event.t >= limitTime)

    // Only keep first event if it's within the time limit
    const result =
      firstEvent && firstEvent.t >= limitTime
        ? [firstEvent, ...validEvents]
        : validEvents
    return result
  }

  function computeCpuActivity(
    curTime: number,
    limitTime: number,
    events: ActivityEvent[],
  ): void {
    let totalActiveTime = 0
    let lastActiveTime = limitTime
    let lastWasActive = false

    for (const event of events) {
      const eventTime = Math.max(event.t, limitTime)

      if (event.state === 'ready') {
        totalActiveTime += eventTime - lastActiveTime
        lastWasActive = false
      } else {
        lastActiveTime = eventTime
        lastWasActive = true
      }
    }

    if (lastWasActive) {
      totalActiveTime += curTime - lastActiveTime
    }

    const percentage = Math.ceil((totalActiveTime / 10000) * 100)
    store.set(cpuStateAtom, (prev) => ({ ...prev, percentage }))
  }

  function cleanupEvents(): void {
    const curTime = Date.now()
    const limitTime = curTime - 10000
    const currentCpuState = store.get(cpuStateAtom)
    const newCpuEvents = expireEvents(currentCpuState.events, limitTime)

    // Clear interval if no events remain
    if (newCpuEvents.length === 0 && currentCpuState.cleanupInterval !== 0) {
      clearInterval(currentCpuState.cleanupInterval)
      store.set(cpuStateAtom, (prev) => ({
        ...prev,
        events: newCpuEvents,
        cleanupInterval: 0,
      }))
    } else {
      store.set(cpuStateAtom, (prev) => ({ ...prev, events: newCpuEvents }))
    }

    computeCpuActivity(curTime, limitTime, newCpuEvents)
  }

  function hddCallback(state: string | number): void {
    store.set(diskStateAtom, (prev) => ({
      ...prev,
      activity: state !== 'ready',
    }))
  }

  function latencyCallback(latency: string | number): void {
    store.set(diskStateAtom, (prev) => {
      const newLatencies = [...prev.latencies, Number(latency)]
      if (newLatencies.length > 30) {
        newLatencies.shift()
      }
      // Calculate average latency
      const total = newLatencies.reduce((sum, l) => sum + l, 0)
      const averageLatency =
        newLatencies.length > 0 ? Math.ceil(total / newLatencies.length) : 0
      return { ...prev, latencies: newLatencies, latency: averageLatency }
    })
  }

  function cpuCallback(state: string | number): void {
    const curTime = Date.now()
    const limitTime = curTime - 10000
    const currentCpuState = store.get(cpuStateAtom)
    const newEvents = expireEvents(currentCpuState.events, limitTime)
    const updatedEvents = [
      ...newEvents,
      { t: curTime, state: state as 'ready' | 'active' },
    ]

    // Clear existing interval if any
    if (currentCpuState.cleanupInterval !== 0) {
      clearInterval(currentCpuState.cleanupInterval)
    }

    // Set up new interval
    const interval = setInterval(cleanupEvents, 2000)

    // Batch all state updates into a single call
    store.set(cpuStateAtom, (prev) => ({
      ...prev,
      activity: state !== 'ready',
      events: updatedEvents,
      cleanupInterval: interval,
    }))

    computeCpuActivity(curTime, limitTime, updatedEvents)
  }

  return {
    hddCallback,
    latencyCallback,
    cpuCallback,
  }
}
