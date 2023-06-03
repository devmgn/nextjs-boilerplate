import type { TupleToUnion } from 'type-fest';

const BREAKPOINT_KEYS = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

declare module '@emotion/react' {
  export type BreakpointKey = TupleToUnion<typeof BREAKPOINT_KEYS>;
  export type Breakpoint = BreakpointKey | number;
  export type BreakpointValues = Record<BreakpointKey, number>;
  export type MediaQueries = {
    up: (breakpoint: Breakpoint) => string;
    down: (breakpoint: Breakpoint) => string;
    not: (start: Breakpoint, end: Breakpoint) => string;
    between: (start: Breakpoint, end: Breakpoint) => string;
  };
  export type MediaQueryKey = keyof MediaQueries;

  export interface Theme {
    breakpoints: {
      values: BreakpointValues;
    } & MediaQueries;
  }
}
