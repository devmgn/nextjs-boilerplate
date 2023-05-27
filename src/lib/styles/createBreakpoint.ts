import isKeyOf from '@/utils/isKeyOf';
import type { Breakpoint } from '@/types/theme';
import type { Theme } from '@emotion/react';

type CreateBreakpointParams = {
  theme: Theme;
  breakpoints: [Breakpoint] | [Breakpoint, Breakpoint];
};

const createBreakpoint = ({ theme, breakpoints: [start, end] }: CreateBreakpointParams) => {
  const { values } = theme.breakpoints;
  const isStartNumber = typeof start === 'number';
  const isEndNumber = typeof end === 'number';
  const isStartKey = isKeyOf(values, start) && Object.keys(values).includes(start);
  const isStartOrEndKey = isStartKey && isKeyOf(values, end) && Object.keys(values).includes(end);

  if (isStartKey) {
    return {
      up: `@media (min-width: ${values[start]}px)`,
      down: `@media (max-width: ${values[start] - 1}px)`,
      between: '',
    };
  }

  if (isStartNumber && isEndNumber) {
    return {
      up: `@media (min-width: ${start}px)`,
      down: `@media (max-width: ${start - 1}px)`,
      between: `@media (min-width: ${start}px) and (max-width: ${end - 1}px)`,
    };
  }

  if (isStartOrEndKey) {
    return {
      up: `@media (min-width: ${values[start]}px)`,
      down: `@media (max-width: ${values[start] - 1}px)`,
      between: `@media (min-width: ${values[start]}px) and (max-width: ${values[end] - 1}px)`,
    };
  }

  return {
    up: '',
    down: '',
    between: '',
  };
};

export default createBreakpoint;
