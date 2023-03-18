const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer');

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  poweredByHeader: false,
  compiler: {
    emotion: true,
    reactRemoveProperties: true,
  },
  experimental: {
    scrollRestoration: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

module.exports = withPlugins(
  [withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })],
  nextConfig
);
