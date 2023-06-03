import { DEFAULT_BREAKPOINTS } from './config';
import createBreakpoint from './createBreakpoint';
import type { Breakpoint, Theme } from '@emotion/react';

const theme: Theme = {
  breakpoints: {
    values: DEFAULT_BREAKPOINTS,
    up: (breakpoint: Breakpoint) => createBreakpoint('up', theme, breakpoint),
    down: (breakpoint: Breakpoint) => createBreakpoint('down', theme, breakpoint),
    not: (start: Breakpoint, end: Breakpoint) => createBreakpoint('not', theme, start, end),
    between: (start: Breakpoint, end: Breakpoint) => createBreakpoint('between', theme, start, end),
  },
};

export default theme;
