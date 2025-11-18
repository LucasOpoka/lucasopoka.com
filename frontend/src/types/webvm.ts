// Activity types
export type ActivityState = boolean;
export type Percentage = number;
export type Latency = number;

// Activity event types
export interface ActivityEvent {
  t: number;
  state: 'ready' | 'active';
}

