import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "**/*.d.ts",
        "**/*.test-d.{ts,tsx}",
        "src/**/*.stories.tsx",
        "src/{api/openapi,mocks}/**",
        "src/{instrumentation-client,instrumentation}.ts",
        "src/app/**/{default,error,forbidden,global-error,global-not-found,layout,loading,not-found,page,route,template,unauthorized}.{ts,tsx}",
      ],
    },
    fsModuleCache: true,
    globals: true,
    mockReset: true,
    pool: "threads",
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    projects: [
      {
        extends: true,
        plugins: [react({ compiler: true })],
        test: {
          name: "unit",
          include: ["src/**/*.{test,spec}.{ts,tsx}"],
          environment: "happy-dom",
          globalSetup: "./vitest.global-setup.ts",
          setupFiles: ["@testing-library/jest-dom/vitest"],
          typecheck: {
            enabled: true,
          },
        },
      },
      {
        extends: true,
        test: {
          name: "oxlint-rules",
          include: ["tools/oxlint-rules/**/*.test.ts"],
        },
      },
      {
        extends: true,
        plugins: [storybookTest()],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            // unit の TZ (vitest.global-setup.ts) とアプリの <html lang="ja"> に揃える。
            // 未指定だと headless Chromium は環境変数に関係なく en-US で動く
            provider: playwright({
              contextOptions: { locale: "ja-JP", timezoneId: "Asia/Tokyo" },
            }),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
