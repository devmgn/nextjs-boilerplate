const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    'storybook-dark-mode',
    'storybook-addon-next',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  webpackFinal: async (config) => {
    // import aliasの設定
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
    };

    // svgr有効化の設定
    const fileLoaderRule = config.module.rules.find((rule) => rule.test && rule.test?.test('.svg'));
    fileLoaderRule.exclude = /\.svg$/;

    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              typescript: true,
              svgoConfig: {
                plugins: [
                  {
                    name: 'preset-default',
                    params: {
                      overrides: {
                        removeViewBox: false,
                        removeUnknownsAndDefaults: {
                          keepDataAttrs: false,
                        },
                      },
                    },
                  },
                  {
                    name: 'removeAttrs',
                    params: {
                      attrs: 'fill',
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    ];

    return config;
  },
};
