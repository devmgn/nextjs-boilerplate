import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compiler: {
    reactRemoveProperties: true,
  },
  experimental: {
    reactCompiler: true,
  },
  serverExternalPackages: ["pino"],
  webpack: createSvgrWebpackConfig,
};

// biome-ignore lint/style/noDefaultExport: <explanation>
export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);

/**
 * Modify the Webpack configuration to handle SVG imports in a special way.
 * @see https://react-svgr.com/docs/next/
 */
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function createSvgrWebpackConfig(config: any) {
  // Grab the existing rule that handles SVG imports
  // @ts-expect-error
  const fileLoaderRule = config.module.rules.find((rule) =>
    rule.test?.test?.(".svg"),
  );

  config.module.rules.push(
    // Reapply the existing rule, but only for svg imports ending in ?url
    {
      ...fileLoaderRule,
      // biome-ignore lint/performance/useTopLevelRegex: <explanation>
      test: /\.svg$/i,
      // biome-ignore lint/performance/useTopLevelRegex: <explanation>
      resourceQuery: /url/, // *.svg?url
    },
    // Convert all other *.svg imports to React components
    {
      // biome-ignore lint/performance/useTopLevelRegex: <explanation>
      test: /\.svg$/i,
      issuer: fileLoaderRule.issuer || "",
      resourceQuery: {
        // biome-ignore lint/performance/useTopLevelRegex: <explanation>
        not: [...(fileLoaderRule?.resourceQuery?.not || []), /url/],
      }, // exclude if *.svg?url
      use: ["@svgr/webpack"],
    },
  );

  // Modify the file loader rule to ignore *.svg, since we have it handled now.
  // biome-ignore lint/performance/useTopLevelRegex: <explanation>
  fileLoaderRule.exclude = /\.svg$/i;

  return config;
}
