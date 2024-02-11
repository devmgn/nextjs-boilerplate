import React from 'react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import locale from 'axe-core/locales/ja.json';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { RootProvider } from '../src/providers';
import type { Preview } from '@storybook/react';
import { ErrorBoundary } from './ErrorBoundary';

initialize({ onUnhandledRequest: 'bypass' });

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
  loaders: [mswLoader],
  decorators: [
    (Story) => (
      <RootProvider>
        <ErrorBoundary>
          <Story />
        </ErrorBoundary>
      </RootProvider>
    ),
  ],
};

export default preview;
