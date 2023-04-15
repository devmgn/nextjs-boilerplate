import isKeyOf from '@/helpers/isKeyOf';
import type { BreakpointKey } from '@/types/theme';
import type { Theme } from '@emotion/react';

type Breakpoint = number | BreakpointKey;
type CreateBreakpointParams = {
  theme: Theme;
  breakpoints: [Breakpoint] | [Breakpoint, Breakpoint];
};

const createBreakpoint = ({ theme, breakpoints: [start, end] }: CreateBreakpointParams) => {
  const { values } = theme.breakpoints;
  const initialValue = {
    up: '',
    down: '',
    between: '',
  };
  const isStartNumber = typeof start === 'number';
  const isEndNumber = typeof end === 'number';
  const isStartKey = isKeyOf(values, start) && Object.keys(values).includes(start);
  const isEndKey = isKeyOf(values, end) && Object.keys(values).includes(end);

  if (isStartKey) {
    Object.assign(initialValue, {
      up: `@media (min-width: ${values[start]}px)`,
      down: `@media (max-width: ${values[start] - 1}px)`,
    });
  }
  if (isStartNumber) {
    Object.assign(initialValue, {
      up: `@media (min-width: ${start}px)`,
      down: `@media (max-width: ${start - 1}px)`,
    });
  }
  if (isStartKey && isEndKey) {
    Object.assign(initialValue, {
      between: `@media (min-width: ${values[start]}px) and (max-width: ${values[end] - 1}px)`,
    });
  }
  if (isStartNumber && isEndNumber) {
    Object.assign(initialValue, {
      between: `@media (min-width: ${start}px) and (max-width: ${end - 1}px)`,
    });
  }

  return initialValue;
};

const theme: Theme = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
    up: (breakpoint: Breakpoint) => createBreakpoint({ theme, breakpoints: [breakpoint] }).up,
    down: (breakpoint: Breakpoint) => createBreakpoint({ theme, breakpoints: [breakpoint] }).down,
    between: (start: Breakpoint, end: Breakpoint) =>
      createBreakpoint({ theme, breakpoints: [start, end] }).between,
  },
};

export default theme;
