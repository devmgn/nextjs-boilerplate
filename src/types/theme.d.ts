import type { TupleToUnion } from 'type-fest';

const BREAKPOINT_KEYS = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export type BreakpointKey = TupleToUnion<typeof BREAKPOINT_KEYS>;

export type Breakpoint = BreakpointKey | number;

declare module '@emotion/react' {
  interface Breakpoints {
    values: Record<BreakpointKey, number>;
    up: (breakpoint: Breakpoint) => string;
    down: (breakpoint: Breakpoint) => string;
    between: (start: Breakpoint, end: Breakpoint) => string;
  }

  export interface Theme {
    breakpoints: Breakpoints;
  }
}
