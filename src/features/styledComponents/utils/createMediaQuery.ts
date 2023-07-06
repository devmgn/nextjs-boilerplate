import isKeyOf from '@/utils/isKeyOf';
import type { MediaQueryKey, DefaultTheme, Breakpoint } from 'styled-components';

const createMediaQuery = (
  key: MediaQueryKey,
  theme: DefaultTheme,
  breakpoint: Breakpoint,
  endBreakpoint?: Breakpoint,
) => {
  const { values } = theme.breakpoints;
  const width = isKeyOf(values, breakpoint) ? values[breakpoint] : breakpoint;
  const endWidth = isKeyOf(values, endBreakpoint) ? values[endBreakpoint] : endBreakpoint;

  if (key === 'up') {
    return `@media (min-width: ${width}px)`;
  }
  if (key === 'down') {
    return `@media (max-width: ${Math.max(width - 1, 0)}px)`;
  }
  if (key === 'not' && endWidth !== undefined) {
    return `@media not all and (min-width: ${width}px) and (max-width: ${endWidth - 1}px)`;
  }
  if (key === 'between' && endWidth !== undefined) {
    return `@media (min-width: ${width}px) and (max-width: ${endWidth - 1}px)`;
  }
  throw new Error(`createBreakpoint: invalid key or breakpoint provided`);
};

export default createMediaQuery;
