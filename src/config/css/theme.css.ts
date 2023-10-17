import { createGlobalTheme, styleVariants } from '@vanilla-extract/css';
import { numberToCssUnit } from '@/utils/numberToCssUnit';

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
    xs: numberToCssUnit(375),
    sm: numberToCssUnit(600),
    md: numberToCssUnit(900),
    lg: numberToCssUnit(1200),
    xl: numberToCssUnit(1536),
  },
});

export const colorVariant = styleVariants({
  primary: { color: theme.color.primary },
  secondary: { color: theme.color.secondary },
  text: { color: theme.color.text },
  contrastText: { color: theme.color.contrastText },
});
