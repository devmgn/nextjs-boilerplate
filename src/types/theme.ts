import type { theme } from '@/config';

export type Theme = {
  color: keyof typeof theme.color;
  iconSize: keyof typeof theme.iconSize;
};
