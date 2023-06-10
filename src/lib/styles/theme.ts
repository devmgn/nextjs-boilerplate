import { BREAKPOINTS } from '@/config';
import createMediaQuery from './createMediaQuery';
import type { Breakpoint, Theme } from '@emotion/react';

const theme: Theme = {
  breakpoints: {
    values: BREAKPOINTS,
    up: (breakpoint: Breakpoint) => createMediaQuery('up', theme, breakpoint),
    down: (breakpoint: Breakpoint) => createMediaQuery('down', theme, breakpoint),
    not: (start: Breakpoint, end: Breakpoint) => createMediaQuery('not', theme, start, end),
    between: (start: Breakpoint, end: Breakpoint) => createMediaQuery('between', theme, start, end),
  },
};

export default theme;
