const withPlugins = require('next-compose-plugins');
const bundleAnalyzer = require('@next/bundle-analyzer');
// @ts-ignore
// TODO: this plugin is not fully support nextjs v12
const optimizedImages = require('next-optimized-images');
const appSettings = require('./appSettings.json');

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // basePath: '/',
  reactStrictMode: true,
  trailingSlash: true,
  poweredByHeader: false,
  generateEtags: false,
  esmExternals: false,
  compiler: {
    styledComponents: true,
    reactRemoveProperties: true,
  },
  images: {
    disableStaticImages: true,
  },
  webpack: (config) => {
    Object.assign(config.externals, appSettings);
    return config;
  },
};

const bundleAnalyzerConfig = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const optimizedImagesConfig = {
  inlineImageLimit: 1,
  optimizeImagesInDev: true,
  mozjpeg: {
    quality: 10,
  },
  pngquant: {},
  svgo: {
    name: 'preset-default',
    params: {
      overrides: {
        removeAttrs: {
          params: { attrs: ['data.*'] },
        },
      },
    },
  },
};

module.exports = withPlugins([bundleAnalyzerConfig, [optimizedImages, optimizedImagesConfig]], nextConfig);
