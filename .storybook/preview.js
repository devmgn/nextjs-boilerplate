import React from 'react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { LazyMotion, domAnimation } from 'framer-motion';
import GlobalStyle from '../src/styles/GlobalStyle';
import createEmotionCache from '../src/styles/createEmotionCache';
import { CacheProvider } from '@emotion/react';

const emotionCache = createEmotionCache();

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
        <CacheProvider value={emotionCache}>
          <GlobalStyle />
          <Story />
        </CacheProvider>
      </LazyMotion>
    </div>
  ),
];
