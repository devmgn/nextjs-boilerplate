import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// biome-ignore lint/style/noDefaultExport: <explanation>
export default defineConfig({
  test: {
    coverage: {
      include: ["src/**"],
      exclude: ["**/*.stories.*", "**/*.d.ts"],
    },
    workspace: [
      {
        extends: true,
        plugins: [react()],
        test: {
          name: "unit",
          globals: true,
          environment: "jsdom",
          globalSetup: path.resolve(__dirname, "./vitest.globalSetup.ts"),
          setupFiles: path.resolve(__dirname, "./vitest.setup.ts"),
          typecheck: { enabled: true },
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/writing-tests/test-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, ".storybook") }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: "playwright",
            instances: [{ browser: "chromium" }],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});
