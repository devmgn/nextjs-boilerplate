import React from 'react';
import GlobalStyle from '../src/styles/GlobalStyle';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { LazyMotion, domAnimation } from 'framer-motion';

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
