import type { StorybookConfig } from "@storybook/nextjs-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-vitest",
    {
      name: "@storybook/addon-mcp",
      options: {
        toolsets: {
          dev: true,
          docs: true,
        },
      },
    },
    "msw-storybook-addon",
  ],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  typescript: {
    // Storybook's default babel-based docgen. The more accurate `react-docgen-typescript`
    // touches TypeScript's JS API (e.g. `ts.sys`) directly, so with typescript@7, a native
    // implementation without a JS API, `build-storybook` crashes with
    // `TypeError: Cannot read properties of undefined (reading 'fileExists')`.
    // Upstream is waiting on the TS 7.1 programmatic API (microsoft/typescript-go#2824,
    // milestone Post-7.0), so use this until that lands.
    // The trade-off: `React.ComponentProps<"div">` and `VariantProps<typeof variants>`
    // cannot be expanded, so the Docs props table is less complete.
    reactDocgen: "react-docgen",
  },
  staticDirs: ["../public"],
  viteFinal: (viteConfig) => ({
    ...viteConfig,
    plugins: [...(viteConfig.plugins ?? []), tailwindcss()],
  }),
};

export default config;
