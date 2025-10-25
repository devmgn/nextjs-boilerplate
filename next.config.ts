import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const nextConfig = {
  compiler: {
    reactRemoveProperties: true,
  },
  experimental: {
    authInterrupts: true,
    turbopackFileSystemCacheForDev: true,
    viewTransition: true,
  },
  poweredByHeader: false,
  reactCompiler: true,
  typedRoutes: true,
} satisfies NextConfig;

// biome-ignore lint/style/noDefaultExport: using default export
export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
