import type { Transition } from 'framer-motion';

export const TRANSITION_DURATION = 0.3 as const;
export const EASING = 'easeInOut' as const;
export const TRANSITION: Transition = {
  duration: TRANSITION_DURATION,
  ease: EASING,
} as const;

export const VARIANTS = {
  active: { opacity: 1 },
  inactive: { opacity: 0 },
};
