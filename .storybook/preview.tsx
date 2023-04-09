import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import GlobalStyle from '../src/styles/GlobalStyle';
import theme from '../src/styles/theme';
import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
    backgrounds: {
      default: 'light',
    },
    docs: {
      source: { language: 'tsx' },
    },
  },
  decorators: [
    (Story) => (
      <div id="__next">
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Story />
        </ThemeProvider>
      </div>
    ),
  ],
};

export default preview;
