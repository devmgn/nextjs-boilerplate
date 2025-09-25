import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// biome-ignore lint/style/noDefaultExport: use default export
export default defineConfig({
  test: {
    coverage: {
      include: ["src/**"],
      exclude: ["**/*.d.ts", "src/mocks/**", "src/api/**", "**/*.stories.tsx"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
    testTimeout: 10_000,
    hookTimeout: 10_000,
    projects: [
      {
        extends: true,
        plugins: [react()],
        test: {
          name: "unit",
          globals: true,
          environment: "jsdom",
          globalSetup: "./vitest.globalSetup.ts",
          setupFiles: "./vitest.setup.ts",
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/writing-tests/test-addon#storybooktest
          storybookTest({
            configDir: ".storybook",
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
