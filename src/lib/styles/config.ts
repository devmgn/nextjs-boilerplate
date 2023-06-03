import type { BreakpointKey } from '@emotion/react';

export const FONT_FAMILY = {
  SANS_SERIF: 'system-ui, -apple-system, sans-serif',
  SERIF: 'serif',
  MONOSPACE: 'monospace, monospace',
} as const;

export const DEFAULT_BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const satisfies Record<BreakpointKey, number>;
