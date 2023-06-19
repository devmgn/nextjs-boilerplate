import { BREAKPOINTS, TRANSITION_DURATIONS, TRANSITION_TIMING_FUNCTIONS } from '@/config';
import createMediaQuery from './createMediaQuery';
import createTransition from './createTransition';
import type { Breakpoint, Theme } from '@emotion/react';

const theme: Theme = {
  breakpoints: {
    values: BREAKPOINTS,
    up: (breakpoint: Breakpoint) => createMediaQuery('up', theme, breakpoint),
    down: (breakpoint: Breakpoint) => createMediaQuery('down', theme, breakpoint),
    not: (start: Breakpoint, end: Breakpoint) => createMediaQuery('not', theme, start, end),
    between: (start: Breakpoint, end: Breakpoint) => createMediaQuery('between', theme, start, end),
  },
  transitions: {
    easing: TRANSITION_TIMING_FUNCTIONS,
    duration: TRANSITION_DURATIONS,
    create: createTransition,
  },
};

export default theme;
