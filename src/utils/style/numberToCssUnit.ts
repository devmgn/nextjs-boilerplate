import type { CssUnit } from '@/types';

export const numberToCssUnit = (value: number, unit: CssUnit = 'px') =>
  `${value}${unit}`;
