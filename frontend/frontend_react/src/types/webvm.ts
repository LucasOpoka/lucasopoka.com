// Activity types
export type ActivityState = boolean;
export type Percentage = number;
export type Latency = number;

// Activity event types
export interface ActivityEvent {
  t: number;
  state: 'ready' | 'active';
}


export interface WebVMProps {
  cacheId?: string;
  cpuActivityEvents?: ActivityEvent[];
  diskLatencies?: number[];
  activityEventsInterval?: number;
  configObj?: ConfigObj;
}

// CheerpX types
export type DiskImageType = 'cloud' | 'bytes' | 'github';

export interface CheerpXConfig {
  diskImageUrl: string;
  diskImageType: DiskImageType;
  printIntro: boolean;
  needsDisplay: boolean;
  cmd: string;
  args: string[];
  opts: {
    env: string[];
    cwd: string;
    uid: number;
    gid: number;
  };
}

// Configuration object type
export interface ConfigObj {
  diskImageUrl: string;
  diskImageType: DiskImageType;
  printIntro: boolean;
  needsDisplay: boolean;
  cmd: string;
  args: string[];
  opts: {
    env: string[];
    cwd: string;
    uid: number;
    gid: number;
  };
}

// Terminal types
export interface TerminalSize {
  cols: number;
  rows: number;
}

// CheerpX callback types
export type CpuActivityCallback = (state: string | number) => void;
export type DiskActivityCallback = (state: string | number) => void;
export type DiskLatencyCallback = (latency: string | number) => void;
export type WriteDataCallback = (buffer: Uint8Array, vt: number) => void;
