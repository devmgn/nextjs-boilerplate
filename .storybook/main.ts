import { StorybookConfig } from '@storybook/nextjs';
import { VanillaExtractPlugin } from '@vanilla-extract/webpack-plugin';
import path from 'path';

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
  docs: {
    autodocs: true,
  },
  staticDirs: ['../public'],
  webpackFinal: async (config) => {
    if (!config.resolve || !config.module?.rules) {
      return config;
    }

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

    config.plugins = [...(config.plugins ?? []), new VanillaExtractPlugin()];

    return config;
  },
};

export default config;
