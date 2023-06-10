import { BREAKPOINTS } from '@/config';
import createMediaQuery from '../createMediaQuery';
import type { Theme } from '@emotion/react';

const theme = {
  breakpoints: {
    values: BREAKPOINTS,
  },
} as Theme;

type Params = Parameters<typeof createMediaQuery>;

const testPatterns: [Params[0], Params[2], Params[3], string][] = [
  ['up', 'xs', undefined, '@media (min-width: 0px)'],
  ['up', 'sm', undefined, '@media (min-width: 600px)'],
  ['up', 'md', undefined, '@media (min-width: 900px)'],
  ['up', 'lg', undefined, '@media (min-width: 1200px)'],
  ['up', 'xl', undefined, '@media (min-width: 1536px)'],
  ['up', 0, undefined, '@media (min-width: 0px)'],
  ['up', 600, undefined, '@media (min-width: 600px)'],
  ['down', 'xs', undefined, '@media (max-width: 0px)'],
  ['down', 'sm', undefined, '@media (max-width: 599px)'],
  ['down', 'md', undefined, '@media (max-width: 899px)'],
  ['down', 'lg', undefined, '@media (max-width: 1199px)'],
  ['down', 'xl', undefined, '@media (max-width: 1535px)'],
  ['down', 0, undefined, '@media (max-width: 0px)'],
  ['down', 600, undefined, '@media (max-width: 599px)'],
  ['not', 'xs', 'sm', '@media not all and (min-width: 0px) and (max-width: 599px)'],
  ['not', 'sm', 'md', '@media not all and (min-width: 600px) and (max-width: 899px)'],
  ['not', 'md', 'lg', '@media not all and (min-width: 900px) and (max-width: 1199px)'],
  ['not', 'lg', 'xl', '@media not all and (min-width: 1200px) and (max-width: 1535px)'],
  ['not', 0, 600, '@media not all and (min-width: 0px) and (max-width: 599px)'],
  ['not', 600, 900, '@media not all and (min-width: 600px) and (max-width: 899px)'],
  ['between', 'xs', 'sm', '@media (min-width: 0px) and (max-width: 599px)'],
  ['between', 'sm', 'md', '@media (min-width: 600px) and (max-width: 899px)'],
  ['between', 'md', 'lg', '@media (min-width: 900px) and (max-width: 1199px)'],
  ['between', 'lg', 'xl', '@media (min-width: 1200px) and (max-width: 1535px)'],
  ['between', 0, 600, '@media (min-width: 0px) and (max-width: 599px)'],
  ['between', 600, 900, '@media (min-width: 600px) and (max-width: 899px)'],
];

const errorTestPatterns: [Params[0], Params[2], Params[3]][] = [
  ['not', 'xs', undefined],
  ['not', 0, undefined],
  ['between', 'xs', undefined],
  ['between', 0, undefined],
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ['invallidKey', 'xs', 'sm'],
];

describe('createMediaQuery', () => {
  test.each(testPatterns)(
    'keyが%s、breakpointが%s、endBreakpointが%sのとき、%sを返すこと',
    (key, breakpoint, endBreakpoint, expected) => {
      expect(createMediaQuery(key, theme, breakpoint, endBreakpoint)).toBe(expected);
    }
  );

  test.each(errorTestPatterns)(
    'keyが%s、breakpointが%s、endBreakpointが%sのとき、エラーをスローすること',
    (key, breakpoint, endBreakpoint) => {
      expect(() => createMediaQuery(key, theme, breakpoint, endBreakpoint)).toThrow(Error);
    }
  );
});
