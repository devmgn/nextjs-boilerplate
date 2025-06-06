import locale from "axe-core/locales/ja.json" with { type: "json" };
import { initialize, mswLoader } from "msw-storybook-addon";
import { SbProvider } from "./providers/SbProvider";
import type { Preview } from "@storybook/nextjs-vite";

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
      test: "todo",
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

// biome-ignore lint/style/noDefaultExport: ues default export
export default preview;
