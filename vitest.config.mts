import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// biome-ignore lint/style/noDefaultExport: use default export
export default defineConfig({
  test: {
    coverage: {
      include: ["src/**"],
      exclude: ["**/*.d.ts", "src/mocks/**", "src/api/**"],
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
          storybookTest({
            configDir: path.resolve(__dirname, ".storybook"),
            tags: {
              include: ["test"],
              exclude: [],
              skip: [],
            },
          }),
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
