import createBreakpoint from './createBreakpoint';
import type { Breakpoint } from '@/types/theme';
import type { Theme } from '@emotion/react';

const defaultBreakPoint = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;

const theme: Theme = {
  breakpoints: {
    values: defaultBreakPoint,
    up: (breakpoint: Breakpoint) => createBreakpoint({ theme, breakpoints: [breakpoint] }).up,
    down: (breakpoint: Breakpoint) => createBreakpoint({ theme, breakpoints: [breakpoint] }).down,
    between: (start: Breakpoint, end: Breakpoint) =>
      createBreakpoint({ theme, breakpoints: [start, end] }).between,
  },
};

export default theme;
