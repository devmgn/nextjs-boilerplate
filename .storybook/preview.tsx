import React from 'react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import locale from 'axe-core/locales/ja.json';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { RootProvider } from '../src/providers';
import { SBErrorBoundary } from './SBErrorBoundary';
import type { Preview } from '@storybook/react';

initialize({ onUnhandledRequest: 'bypass' });

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
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
        <SBErrorBoundary>
          <Story />
        </SBErrorBoundary>
      </RootProvider>
    ),
  ],
};

export default preview;
