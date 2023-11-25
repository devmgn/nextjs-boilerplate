import { createSprinkles } from '@vanilla-extract/sprinkles';
import marginProperties from './margin.css';

export const sprinkles = createSprinkles(marginProperties);

export type Sprinkles = Parameters<typeof sprinkles>[0];
