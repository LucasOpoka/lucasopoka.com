import { atom } from 'jotai';
import type { FitAddon } from '@xterm/addon-fit';
import type { ActivityEvent } from '../types/webvm';
import type { IDBDevice } from '@leaningtech/cheerpx';

export const cpuActivityAtom = atom(false);
export const diskActivityAtom = atom(false);
export const cpuPercentageAtom = atom(0);
export const diskLatencyAtom = atom(0);

// WebVM component atoms
export const fitAddonAtom = atom<FitAddon | null>(null);
export const blockCacheAtom = atom<IDBDevice | null>(null);
export const cpuActivityEventsAtom = atom<ActivityEvent[]>([]);
export const diskLatenciesAtom = atom<number[]>([]);
export const activityEventsIntervalAtom = atom<number>(0);
