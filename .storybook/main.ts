import type { StorybookConfig } from "@storybook/nextjs-vite";
import remarkGfm from "remark-gfm";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-a11y",
    {
      name: "@storybook/addon-docs",
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
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
    // Storybook 既定の babel ベース docgen。精度の高い `react-docgen-typescript` は
    // `ts.sys` など TypeScript の JS API を直接触るため、ネイティブ実装で JS API を
    // 持たない typescript@7 では `build-storybook` が
    // `TypeError: Cannot read properties of undefined (reading 'fileExists')` で落ちる。
    // upstream は TS 7.1 の programmatic API (microsoft/typescript-go#2824, milestone
    // Post-7.0) を待っている状態なので、それが着地するまでこちらを使う。
    // 代償として `React.ComponentProps<"div">` や `VariantProps<typeof variants>` の
    // 展開ができず、Docs の props テーブルの網羅性が落ちる。
    reactDocgen: "react-docgen",
  },
  staticDirs: ["../public"],
};

export default config;
