const BREAKPOINT_KEYS = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export type BreakpointKey = (typeof BREAKPOINT_KEYS)[number];

declare module '@emotion/react' {
  interface Breakpoints {
    values: Record<BreakpointKey, number>;
    up: (breakpoint: BreakpointKey | number) => string;
    down: (breakpoint: BreakpointKey | number) => string;
    between: (start: BreakpointKey | number, end: BreakpointKey | number) => string;
  }

  export interface Theme {
    breakpoints: Breakpoints;
  }
}
