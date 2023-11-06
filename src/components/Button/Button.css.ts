import { globalStyle, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { theme } from '@/config';
import { numberToCssUnit } from '@/utils';
import type { RecipeVariants } from '@vanilla-extract/recipes';

const base = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px 16px',
  border: '1px solid currentColor',
  borderRadius: numberToCssUnit(8),
  fontSize: numberToCssUnit(14),
  lineHeight: theme.font.lineHeight.normal,
  backgroundColor: theme.color.primary,
  color: theme.color.contrastText,
  fontWeight: theme.font.weight.bold,
  ':hover': {
    opacity: '0.8',
  },
});

export const button = recipe({
  base,
  variants: {
    rounded: {
      true: {
        borderRadius: numberToCssUnit(999),
      },
    },
    fullWidth: {
      true: {
        width: '100%',
      },
    },
  },
  defaultVariants: {
    rounded: false,
    fullWidth: true,
  },
});

globalStyle(`${base}.disabled`, {
  pointerEvents: 'none',
});

export type ButtonVariants = RecipeVariants<typeof button>;
