import { createGlobalTheme } from '@vanilla-extract/css';
import { createStyleVariants, numberToCssUnit } from '@/utils';

export const theme = createGlobalTheme(':root', {
  color: {
    primary: 'red',
    secondary: 'blue',
    text: '#111',
    contrastText: '#eee',
  },
  font: {
    family: {
      sansSerif: 'system-ui, -apple-system, sans-serif',
      serif: 'serif',
      monospace: 'monospace, monospace',
    },
  },
  breakpoint: {
    xs: numberToCssUnit(375),
    sm: numberToCssUnit(600),
    md: numberToCssUnit(900),
    lg: numberToCssUnit(1200),
    xl: numberToCssUnit(1536),
  },
});

export const colorVariant = createStyleVariants(theme.color, 'color');
export const fontFamilyVariant = createStyleVariants(
  theme.font.family,
  'fontFamily',
);
