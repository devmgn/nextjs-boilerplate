// biome-ignore lint/correctness/useJsonImportAttributes: Disabled due to warnings when launching Storybook
import locale from "axe-core/locales/ja.json";
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
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
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
