import type { Preview } from "@storybook/nextjs-vite";
import locale from "axe-core/locales/ja.json";
import { initialize, mswLoader } from "msw-storybook-addon";
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from "react";
import { SbProvider } from "./providers/SbProvider";

initialize({ onUnhandledRequest: "bypass" });

const preview: Preview = {
  parameters: {
    globals: {
      locale: "ja",
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      config: { locale },
      // @see https://storybook.js.org/docs/writing-tests/accessibility-testing#configure-accessibility-tests-with-the-test-addon
      test: "error",
    },
  },
  loaders: [mswLoader],
  decorators: [
    (Story) => (
      <SbProvider>
        <Story />
      </SbProvider>
    ),
  ],
};

// biome-ignore lint/style/noDefaultExport: <explanation>
export default preview;
