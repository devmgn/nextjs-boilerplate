import withPlugins from 'next-compose-plugins';
import withBundleAnalyzer from '@next/bundle-analyzer';

export const createSvgrWebpackConfig = (config) => {
  const fileLoaderRule = config.module.rules.find((rule) =>
    rule.test?.test?.('.svg'),
  );

  config.module.rules.push(
    {
      ...fileLoaderRule,
      test: /\.svg$/i,
      resourceQuery: { not: /inline/ },
    },
    {
      test: /\.svg$/i,
      issuer: fileLoaderRule.issuer,
      resourceQuery: /inline/,
      use: ['@svgr/webpack'],
    },
  );

  fileLoaderRule.exclude = /\.svg$/i;

  return config;
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compiler: {
    reactRemoveProperties: true,
  },
  webpack: createSvgrWebpackConfig,
};

export default withPlugins(
  [withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })],
  nextConfig,
);
