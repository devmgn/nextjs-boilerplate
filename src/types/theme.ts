import type { vars } from '@/config/css/theme.css';

export type Theme = {
  color: keyof typeof vars.color;
};
