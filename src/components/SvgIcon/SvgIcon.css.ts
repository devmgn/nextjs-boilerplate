import { createTheme, style, styleVariants } from '@vanilla-extract/css';
import { numberToCssUnit } from '@/utils/numberToCssUnit';

export const svgIcon = style({
  display: 'inline-flex',
  flexShrink: 0,
  width: '1em',
  height: '1em',
});

export const [themeClass, vars] = createTheme({
  xs: numberToCssUnit(12),
  sm: numberToCssUnit(14),
  md: numberToCssUnit(16),
  lg: numberToCssUnit(24),
  xl: numberToCssUnit(32),
});

export const sizeVariant = styleVariants({
  xs: { fontSize: vars.xs },
  sm: { fontSize: vars.sm },
  md: { fontSize: vars.md },
  lg: { fontSize: vars.lg },
  xl: { fontSize: vars.xl },
});
