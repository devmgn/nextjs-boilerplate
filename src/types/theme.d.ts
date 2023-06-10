import type { BREAKPOINTS } from '@/config';
import type { createMediaQuery } from '@/lib/styles';

declare module '@emotion/react' {
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

  export interface Theme {
    breakpoints: {
      values: BreakpointValues;
    } & MediaQueries;
  }
}
