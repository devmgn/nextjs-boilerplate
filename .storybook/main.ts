import path from 'path';
import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  docs: {
    autodocs: false,
  },
  staticDirs: ['../public'],
  webpackFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];

    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
    };

    // @svgr/webpackの有効化
    const fileLoaderRule = config.module.rules.find((rule) => {
      if (
        rule === null ||
        typeof rule !== 'object' ||
        !(rule.test instanceof RegExp)
      ) {
        return false;
      }
      return rule.test.test('.svg');
    });

    if (fileLoaderRule === null || typeof fileLoaderRule !== 'object') {
      return config;
    }

    fileLoaderRule.exclude = /\.svg$/i;
    config.module.rules = [
      ...config.module.rules,
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: { not: /inline/ },
      },
      {
        test: /\.svg$/i,
        resourceQuery: /inline/,
        use: ['@svgr/webpack'],
      },
    ];

    return config;
  },
};

export default config;
