const withBundleAnalyzer = require('@next/bundle-analyzer');
const withPlugins = require('next-compose-plugins');
const withExportImages = require('next-export-optimize-images');

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  poweredByHeader: false,
  generateEtags: false,
  experimental: { esmExternals: false },
  compiler: {
    styledComponents: true,
    reactRemoveProperties: true,
  },
};

module.exports = withPlugins(
  [withExportImages, withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })],
  nextConfig
);
