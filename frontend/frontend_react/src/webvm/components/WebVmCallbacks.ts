import React from 'react';
import { useAtom } from 'jotai';
import { 
  diskStateAtom,
  cpuStateAtom
} from '../WebVmAtoms';
import type { ActivityEvent } from '../../types/webvm';

export function createWebVmCallbacks() {
  const [, setDiskState] = useAtom(diskStateAtom);
  const [cpuState, setCpuState] = useAtom(cpuStateAtom);

  // Create a ref for the activity events interval
  const activityEventsIntervalRef = React.useRef(cpuState.cleanupInterval);
  activityEventsIntervalRef.current = cpuState.cleanupInterval;

  function expireEvents(list: ActivityEvent[], _curTime: number, limitTime: number): ActivityEvent[] {
    const newList = [...list];
    while (newList.length > 1) {
      if (newList[1].t < limitTime) {
        newList.shift();
      } else {
        break;
      }
    }
    return newList;
  }

  function computeCpuActivity(_curTime: number, limitTime: number, events: ActivityEvent[]): void {
    let totalActiveTime = 0;
    let lastActiveTime = limitTime;
    let lastWasActive = false;
    
    for (let i = 0; i < events.length; i++) {
      const e = events[i];
      let eTime = e.t;
      if (eTime < limitTime) eTime = limitTime;
      
      if (e.state === "ready") {
        totalActiveTime += (eTime - lastActiveTime);
        lastWasActive = false;
      } else {
        lastActiveTime = eTime;
        lastWasActive = true;
      }
    }
    
    if (lastWasActive) {
      totalActiveTime += (_curTime - lastActiveTime);
    }
    
    setCpuState(prev => ({ ...prev, percentage: Math.ceil((totalActiveTime / 10000) * 100) }));
  }

  function cleanupEvents(): void {
    const curTime = Date.now();
    const limitTime = curTime - 10000;
    const newCpuEvents = expireEvents(cpuState.events, curTime, limitTime);
    setCpuState(prev => ({ ...prev, events: newCpuEvents }));
    computeCpuActivity(curTime, limitTime, newCpuEvents);
    
    if (newCpuEvents.length === 0) {
      if (activityEventsIntervalRef.current !== 0) {
        clearInterval(activityEventsIntervalRef.current);
        setCpuState(prev => ({ ...prev, cleanupInterval: 0 }));
      }
    }
  }

  function hddCallback(state: string | number): void {
    setDiskState(prev => ({ ...prev, activity: state !== "ready" }));
  }

  function latencyCallback(latency: string | number): void {
    setDiskState(prev => {
      const newLatencies = [...prev.latencies, Number(latency)];
      if (newLatencies.length > 30) {
        newLatencies.shift();
      }
      // Calculate average latency
      const total = newLatencies.reduce((sum, l) => sum + l, 0);
      const averageLatency = newLatencies.length > 0 ? Math.ceil(total / newLatencies.length) : 0;
      return { ...prev, latencies: newLatencies, latency: averageLatency };
    });
  }

  function cpuCallback(state: string | number): void {
    setCpuState(prev => ({ ...prev, activity: state !== "ready" }));
    const curTime = Date.now();
    const limitTime = curTime - 10000;
    const newEvents = expireEvents(cpuState.events, curTime, limitTime);
    const updatedEvents = [...newEvents, { t: curTime, state: state as 'ready' | 'active' }];
    setCpuState(prev => ({ ...prev, events: updatedEvents }));
    computeCpuActivity(curTime, limitTime, updatedEvents);
    
    if (cpuState.cleanupInterval !== 0) {
      clearInterval(cpuState.cleanupInterval);
    }
    const interval = setInterval(cleanupEvents, 2000) as unknown as number;
    setCpuState(prev => ({ ...prev, cleanupInterval: interval }));
    activityEventsIntervalRef.current = interval;
  }

  return {
    hddCallback,
    latencyCallback,
    cpuCallback
  };
}
