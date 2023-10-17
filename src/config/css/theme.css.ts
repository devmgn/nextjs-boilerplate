import { createGlobalTheme, styleVariants } from '@vanilla-extract/css';

const toPx = (number: number) => `${number}px`;

export const vars = createGlobalTheme(':root', {
  color: {
    primary: 'red',
    secondary: 'blue',
    text: '#111',
    contrastText: '#eee',
  },
  breakpoint: {
    xs: toPx(375),
    sm: toPx(600),
    md: toPx(900),
    lg: toPx(1200),
    xl: toPx(1536),
  },
});

export const colorVariant = styleVariants({
  primary: { color: vars.color.primary },
  secondary: { color: vars.color.secondary },
  text: { color: vars.color.text },
  contrastText: { color: vars.color.contrastText },
});
