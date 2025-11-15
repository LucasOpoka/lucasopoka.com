import { atom } from 'jotai';
import type { ActivityEvent } from '../types/webvm';
import type { IDBDevice } from '@leaningtech/cheerpx';

export const diskStateAtom = atom({
  activity: false,
  latencies: [] as number[],
  latency: 0
});

export const cpuStateAtom = atom({
  activity: false,
  percentage: 0,
  events: [] as ActivityEvent[],
  cleanupInterval: 0
});

// WebVM component atoms
export const blockCacheAtom = atom<IDBDevice | null>(null);

// Atom to store the read function of CheerpX
export const cxReadFuncAtom = atom<{ func: ((char: number) => void) | null }>({ func: null });

