import withBundleAnalyzer from "@next/bundle-analyzer";
import withPlugins from "next-compose-plugins";

export const createSvgrWebpackConfig = (config) => {
  const fileLoaderRule = config.module.rules.find((rule) =>
    rule.test?.test?.(".svg"),
  );

  config.module.rules.push(
    {
      ...fileLoaderRule,
      test: /\.svg$/i,
      resourceQuery: /url/, // *.svg?url
    },
    {
      test: /\.svg$/i,
      issuer: fileLoaderRule.issuer,
      resourceQuery: { not: /url/ }, // exclude if *.svg?url
      use: ["@svgr/webpack"],
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
  experimental: {
    reactCompiler: true,
  },
  webpack: createSvgrWebpackConfig,
};

export default withPlugins(
  [withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" })],
  nextConfig,
);
