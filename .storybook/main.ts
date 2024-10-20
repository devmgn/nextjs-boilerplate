// biome-ignore lint/correctness/noNodejsModules: <explanation>
import path from "node:path";
import type { StorybookConfig } from "@storybook/nextjs";
import { createSvgrWebpackConfig } from "../next.config";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  docs: {
    autodocs: "tag",
  },
  staticDirs: ["../public"],
  webpackFinal: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "../src"),
    };

    return createSvgrWebpackConfig(config);
  },
};

// biome-ignore lint/style/noDefaultExport: <explanation>
export default config;
