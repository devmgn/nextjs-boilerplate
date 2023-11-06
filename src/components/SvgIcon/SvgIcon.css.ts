import { recipe } from '@vanilla-extract/recipes';
import { colorVariant } from '@/config';
import { numberToCssUnit } from '@/utils';
import type { RecipeVariants } from '@vanilla-extract/recipes';

export const svgIcon = recipe({
  base: {
    width: '1em',
    height: '1em',
  },
  variants: {
    size: {
      xs: { fontSize: numberToCssUnit(12) },
      sm: { fontSize: numberToCssUnit(16) },
      md: { fontSize: numberToCssUnit(20) },
      lg: { fontSize: numberToCssUnit(24) },
      xl: { fontSize: numberToCssUnit(32) },
    },
    color: colorVariant,
  },
  defaultVariants: {
    size: 'md',
    color: 'text',
  },
});

export type SvgIconVariants = RecipeVariants<typeof svgIcon>;
