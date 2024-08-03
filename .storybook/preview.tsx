import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import locale from "axe-core/locales/ja.json";
import { initialize, mswLoader } from "msw-storybook-addon";
import { SbErrorBoundary } from "./sbErrorBoundary";
import "../src/app/globals.css";
import type { Preview } from "@storybook/react";
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React, { Suspense } from "react";
import { RootProvider } from "../src/providers";

initialize({ onUnhandledRequest: "bypass" });

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
      default: "light",
    },
    docs: {
      source: { language: "tsx" },
    },
    a11y: {
      config: { locale },
    },
  },
  loaders: [mswLoader],
  decorators: [
    (Story) => (
      <RootProvider>
        <SbErrorBoundary>
          <Suspense fallback="loading...">
            <Story />
          </Suspense>
        </SbErrorBoundary>
      </RootProvider>
    ),
  ],
};

export default preview;
