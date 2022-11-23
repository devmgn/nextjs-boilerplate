const path = require('path');
const { getConfigFileParsingDiagnostics } = require('typescript');
module.exports = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    'storybook-addon-next',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  core: {},
  docsPage: {
    docs: 'automatic',
  },
  webpackFinal: async (config) => {
    // import aliasの設定
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
    };
    config.resolve.extensions = ['.js', '.ts', '.tsx'];

    // svgr有効化の設定
    // const fileLoaderRule = config.module.rules.find((rule) => rule.test && rule.test?.test('.svg'));
    // fileLoaderRule.exclude = /\.svg$/;
    // config.module.rules.push({
    //   test: /\.svg$/i,
    //   issuer: /\.[jt]sx?$/,
    //   use: ['@svgr/webpack'],
    // });
    return config;
  },
};
