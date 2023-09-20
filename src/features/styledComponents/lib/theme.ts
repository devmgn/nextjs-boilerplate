import {
  BREAKPOINTS,
  TRANSITION_DURATIONS,
  TRANSITION_TIMING_FUNCTIONS,
  Z_INDEX,
} from '../config';
import createMediaQuery from '../utils/createMediaQuery';
import createTransition from '../utils/createTransition';
import type { Breakpoint, DefaultTheme } from 'styled-components';

const theme: DefaultTheme = {
  breakpoints: {
    values: BREAKPOINTS,
    up: (breakpoint: Breakpoint) => createMediaQuery('up', theme, breakpoint),
    down: (breakpoint: Breakpoint) =>
      createMediaQuery('down', theme, breakpoint),
    not: (start: Breakpoint, end: Breakpoint) =>
      createMediaQuery('not', theme, start, end),
    between: (start: Breakpoint, end: Breakpoint) =>
      createMediaQuery('between', theme, start, end),
  },
  transitions: {
    easing: TRANSITION_TIMING_FUNCTIONS,
    duration: TRANSITION_DURATIONS,
    create: createTransition,
  },
  zIndex: Z_INDEX,
};

export default theme;
