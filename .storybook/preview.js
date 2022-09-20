import React from 'react';
import { GlobalStyle } from '../src/styles';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  layout: 'centered',
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

export const decorators = [
  (Story) => (
    <div id="__next">
      <GlobalStyle />
      <Story />
    </div>
  ),
];
