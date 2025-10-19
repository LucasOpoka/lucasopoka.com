import React from 'react';
import { useAtom } from 'jotai';
import { 
  cpuActivityAtom, 
  diskActivityAtom, 
  diskLatencyAtom,
  cpuActivityEventsAtom,
  diskLatenciesAtom,
  activityEventsIntervalAtom,
  cpuPercentageAtom
} from '../WebVmAtoms';
import type { ActivityEvent } from '../../types/webvm';

export function createWebVmCallbacks() {
  const [, setDiskActivity] = useAtom(diskActivityAtom);
  const [, setDiskLatenciesState] = useAtom(diskLatenciesAtom);
  const [, setDiskLatency] = useAtom(diskLatencyAtom);
  const [, setCpuActivity] = useAtom(cpuActivityAtom);
  const [cpuActivityEventsState, setCpuActivityEventsState] = useAtom(cpuActivityEventsAtom);
  const [activityEventsIntervalState, setActivityEventsIntervalState] = useAtom(activityEventsIntervalAtom);
  const [, setCpuPercentage] = useAtom(cpuPercentageAtom);

  // Create a ref for the activity events interval
  const activityEventsIntervalRef = React.useRef(activityEventsIntervalState);
  activityEventsIntervalRef.current = activityEventsIntervalState;

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
    
    setCpuPercentage(Math.ceil((totalActiveTime / 10000) * 100));
  }

  function cleanupEvents(): void {
    const curTime = Date.now();
    const limitTime = curTime - 10000;
    const newCpuEvents = expireEvents(cpuActivityEventsState, curTime, limitTime);
    setCpuActivityEventsState(newCpuEvents);
    computeCpuActivity(curTime, limitTime, newCpuEvents);
    
    if (newCpuEvents.length === 0) {
      if (activityEventsIntervalRef.current !== 0) {
        clearInterval(activityEventsIntervalRef.current);
        setActivityEventsIntervalState(0);
      }
    }
  }

  function hddCallback(state: string | number): void {
    setDiskActivity(state !== "ready");
  }

  function latencyCallback(latency: string | number): void {
    setDiskLatenciesState(function(prev) {
      const newLatencies = [...prev, Number(latency)];
      if (newLatencies.length > 30) {
        newLatencies.shift();
      }
      const total = newLatencies.reduce(function(sum, l) { return sum + l; }, 0);
      const avg = total / newLatencies.length;
      setDiskLatency(Math.ceil(avg));
      return newLatencies;
    });
  }

  function cpuCallback(state: string | number): void {
    setCpuActivity(state !== "ready");
    const curTime = Date.now();
    const limitTime = curTime - 10000;
    const newEvents = expireEvents(cpuActivityEventsState, curTime, limitTime);
    const updatedEvents = [...newEvents, { t: curTime, state: state as 'ready' | 'active' }];
    setCpuActivityEventsState(updatedEvents);
    computeCpuActivity(curTime, limitTime, updatedEvents);
    
    if (activityEventsIntervalState !== 0) {
      clearInterval(activityEventsIntervalState);
    }
    const interval = setInterval(cleanupEvents, 2000) as unknown as number;
    setActivityEventsIntervalState(interval);
    activityEventsIntervalRef.current = interval;
  }

  return {
    hddCallback,
    latencyCallback,
    cpuCallback
  };
}
