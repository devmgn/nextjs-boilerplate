import babel from "@rolldown/plugin-babel";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "**/*.d.ts",
        "src/**/*.stories.tsx",
        "src/{api,mocks}/**",
        "src/{instrumentation-client,instrumentation,middleware}.ts",
        "src/app/**/{default,error,forbidden,global-error,global-not-found,layout,loading,not-found,page,route,template,unauthorized}.{ts,tsx}",
      ],
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
        plugins: [
          react(),
          // 本番 (Next.js) と同じ memoize 挙動をテストでも担保するため React Compiler を有効化する。
          // @see https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#react-compiler
          babel({ presets: [reactCompilerPreset()] }),
        ],
        test: {
          name: "unit",
          globals: true,
          environment: "happy-dom",
          globalSetup: "./vitest.globalSetup.ts",
          setupFiles: "./vitest.setup.ts",
          restoreMocks: true,
          unstubEnvs: true,
          unstubGlobals: true,
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
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
