import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import locale from 'axe-core/locales/ja.json';
import { theme, GlobalStyles } from '../src/lib/styles';
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
    a11y: {
      config: { locale },
    },
  },
  decorators: [
    (Story) => (
      <div id="__next">
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <Story />
        </ThemeProvider>
      </div>
    ),
  ],
};

export default preview;
