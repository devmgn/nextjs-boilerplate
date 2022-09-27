import React from 'react';
import GlobalStyle from '../src/styles/GlobalStyle';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

/**
 * @type {import('@storybook/csf').Parameters}
 */
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: {
    defaultViewport: 'desktop',
    viewports: {
      desktop: {
        name: 'Desktop',
        styles: {
          width: '1280px',
          height: '840px',
        },
        type: 'desktop',
      },
      mobile: {
        name: 'Mobile',
        styles: {
          width: '375px',
          height: '667px',
        },
        type: 'mobile',
      },
      ...INITIAL_VIEWPORTS,
    },
  },
  backgrounds: {
    default: 'white',
    values: [
      {
        name: 'white',
        value: '#fff',
      },
      {
        name: 'dark',
        value: '#999',
      },
    ],
  },
};

/**
 * @typedef {import("@storybook/react").ReactFramework} ReactFramework
 * @typedef {import("@storybook/csf").Args} Args
 * @type {import('@storybook/csf').DecoratorFunction<ReactFramework, Args>[]}
 */
export const decorators = [
  (Story) => (
    <div id="__next">
      <GlobalStyle />
      <Story />
    </div>
  ),
];
