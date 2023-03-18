const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer');

/** @type {import('next').NextConfig} */
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
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'));
    config.module.rules = [
      ...config.module.rules,
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: { not: /inline/ },
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: /inline/,
        use: ['@svgr/webpack'],
      },
    ];
    fileLoaderRule.exclude = /\.svg$/i;
    return config;
  },
};

module.exports = withPlugins(
  [withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })],
  nextConfig
);
