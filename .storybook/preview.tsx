import type { Preview } from "@storybook/react";
import locale from "axe-core/locales/ja.json";
import { initialize, mswLoader } from "msw-storybook-addon";
import React from "react";
import { SbProvider } from "./providers/SbProvider";

initialize({ onUnhandledRequest: "bypass" });

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      config: { locale },
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

export default preview;
