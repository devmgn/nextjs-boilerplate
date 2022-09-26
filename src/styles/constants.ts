import { createTheme } from 'styled-breakpoints';

export const BREAKPOINTS = createTheme({
  xs: '375px',
  s: '576px',
  m: '768px',
  l: '992px',
  xl: '1200px',
  xxl: '1400px',
});

export const FONT_FAMILY = {
  SANS_SERIF: 'system-ui, -apple-system, sans-serif',
  SERIF: 'serif',
  MONOSPACE: 'monospace, monospace',
} as const;
