import React from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import GlobalStyle from '../src/styles/GlobalStyle';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: {
    viewports: {
      ...INITIAL_VIEWPORTS,
    },
  },
  backgrounds: {
    default: 'light',
  },
  docs: {
    source: { type: 'code' },
  },
};

export const decorators = [
  (Story) => (
    <div id="__next">
      <LazyMotion features={domAnimation}>
        <GlobalStyle />
        <Story />
      </LazyMotion>
    </div>
  ),
];
