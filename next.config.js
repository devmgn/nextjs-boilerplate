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
  webpack(config) {
    config.module.rules.push({
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
    });

    return config;
  },
};

module.exports = withPlugins(
  [withExportImages, withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })],
  nextConfig
);
