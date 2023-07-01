import React from 'react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import locale from 'axe-core/locales/ja.json';
import { ThemeProvider } from 'styled-components';
import { theme, GlobalStyle } from '../src/features/styledComponents';
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
          <GlobalStyle />
          <Story />
        </ThemeProvider>
      </div>
    ),
  ],
};

export default preview;
