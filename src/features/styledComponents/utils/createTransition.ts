import isKeyOf from '@/utils/isKeyOf';
import { TRANSITION_DURATIONS, TRANSITION_TIMING_FUNCTIONS } from '../config';
import type { CSSProperties } from 'react';
import type { DelimiterCase } from 'type-fest';

type Options = {
  duration?:
    | keyof typeof TRANSITION_DURATIONS
    | CSSProperties['transitionDuration']
    | number;
  easing?:
    | keyof typeof TRANSITION_TIMING_FUNCTIONS
    | CSSProperties['transitionTimingFunction'];
  delay?:
    | keyof typeof TRANSITION_DURATIONS
    | CSSProperties['transitionDelay']
    | number;
};

const createTransition = (
  properties: DelimiterCase<keyof CSSProperties, '-'>[],
  options?: Options,
): React.CSSProperties['transition'] => {
  const {
    duration = TRANSITION_DURATIONS.standard,
    easing = TRANSITION_TIMING_FUNCTIONS.easeInOut,
    delay = 0,
  } = options ?? {};

  const formatDuration = (
    targetDuration: Options['duration'] | Options['delay'],
  ) => {
    if (!targetDuration) {
      return '';
    }
    if (typeof targetDuration === 'number') {
      return `${targetDuration}ms`;
    }
    if (isKeyOf(TRANSITION_DURATIONS, targetDuration)) {
      return `${TRANSITION_DURATIONS[targetDuration]}ms`;
    }
    return targetDuration;
  };

  const values = [
    formatDuration(duration),
    isKeyOf(TRANSITION_TIMING_FUNCTIONS, easing)
      ? TRANSITION_TIMING_FUNCTIONS[easing]
      : easing,
    formatDuration(delay),
  ].filter(Boolean);

  return properties
    .map((property) => `${property} ${values.join(' ')}`)
    .join(',');
};

export default createTransition;
