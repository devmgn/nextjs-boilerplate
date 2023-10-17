import { createGlobalTheme, styleVariants } from '@vanilla-extract/css';

const toPx = (number: number) => `${number}px`;

export const theme = createGlobalTheme(':root', {
  color: {
    primary: 'red',
    secondary: 'blue',
    text: '#111',
    contrastText: '#eee',
  },
  fontFamily: {
    sansSerif: 'system-ui, -apple-system, sans-serif',
    serif: 'serif',
    monospace: 'monospace, monospace',
  },
  breakpoint: {
    xs: toPx(375),
    sm: toPx(600),
    md: toPx(900),
    lg: toPx(1200),
    xl: toPx(1536),
  },
  iconSize: {
    xs: toPx(12),
    sm: toPx(14),
    md: toPx(16),
    lg: toPx(20),
    xl: toPx(24),
  },
});

export const colorVariant = styleVariants({
  primary: { color: theme.color.primary },
  secondary: { color: theme.color.secondary },
  text: { color: theme.color.text },
  contrastText: { color: theme.color.contrastText },
});

export const iconSizeVariant = styleVariants({
  xs: { fontSize: theme.iconSize.xs },
  sm: { fontSize: theme.iconSize.sm },
  md: { fontSize: theme.iconSize.md },
  lg: { fontSize: theme.iconSize.lg },
  xl: { fontSize: theme.iconSize.xl },
});
