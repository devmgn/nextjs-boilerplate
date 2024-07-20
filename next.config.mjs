import withBundleAnalyzer from "@next/bundle-analyzer";
import withPlugins from "next-compose-plugins";

const SVG_REGEX = /\.svg$/i;
const RESOURCE_QUERY_REGEX = /url/;

export const createSvgrWebpackConfig = (config) => {
  const fileLoaderRule = config.module.rules.find((rule) =>
    rule.test?.test?.(".svg"),
  );

  config.module.rules.push(
    {
      ...fileLoaderRule,
      test: SVG_REGEX,
      resourceQuery: RESOURCE_QUERY_REGEX, // *.svg?url
    },
    {
      test: SVG_REGEX,
      issuer: fileLoaderRule.issuer,
      resourceQuery: { not: RESOURCE_QUERY_REGEX }, // exclude if *.svg?url
      use: ["@svgr/webpack"],
    },
  );

  fileLoaderRule.exclude = SVG_REGEX;

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
