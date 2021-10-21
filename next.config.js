const withPlugins = require('next-compose-plugins');
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
  webpack: (config) => {
    Object.assign(config.externals, appSettings);
    return config;
  },
};

module.exports = withPlugins([nextConfig]);
