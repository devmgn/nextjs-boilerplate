const appSettings = require('./appSettings.json');
const withPlugins = require('next-compose-plugins');
const withExportImages = require('next-export-optimize-images');
const bundleAnalyzer = require('@next/bundle-analyzer');

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // basePath: '/',
  // reactStrictMode: true,
  // trailingSlash: true,
  // poweredByHeader: false,
  // generateEtags: false,
  // esmExternals: false,
  // compiler: {
  //   styledComponents: true,
  //   reactRemoveProperties: true,
  // },
  webpack: (config) => {
    Object.assign(config.externals, appSettings);
    return config;
  },
};

const bundleAnalyzerConfig = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withPlugins([withExportImages, bundleAnalyzerConfig], nextConfig);
