import type {
  BREAKPOINTS,
  TRANSITION_DURATIONS,
  TRANSITION_TIMING_FUNCTIONS,
  Z_INDEX,
} from '../config';
import type { createMediaQuery, createTransition } from '../utils';

declare module 'styled-components' {
  export type BreakpointKey = keyof typeof BREAKPOINTS;
  export type Breakpoint = BreakpointKey | number;
  export type BreakpointValues = Record<BreakpointKey, number>;
  export type MediaQueries = {
    up: (breakpoint: Breakpoint) => ReturnType<typeof createMediaQuery>;
    down: (breakpoint: Breakpoint) => ReturnType<typeof createMediaQuery>;
    not: (start: Breakpoint, end: Breakpoint) => ReturnType<typeof createMediaQuery>;
    between: (start: Breakpoint, end: Breakpoint) => ReturnType<typeof createMediaQuery>;
  };
  export type MediaQueryKey = keyof MediaQueries;

  export type Transitions = {
    easing: typeof TRANSITION_TIMING_FUNCTIONS;
    duration: typeof TRANSITION_DURATIONS;
    create: (
      properties: Parameters<typeof createTransition>[0],
      options?: Parameters<typeof createTransition>[1],
    ) => ReturnType<typeof createTransition>;
  };

  export type ZIndex = typeof Z_INDEX;

  export interface DefaultTheme {
    breakpoints: {
      values: BreakpointValues;
    } & MediaQueries;
    transitions: Transitions;
    zIndex: ZIndex;
  }
}
