import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compiler: {
    reactRemoveProperties: true,
  },
  experimental: {
    authInterrupts: true,
    reactCompiler: true,
  },
};

// biome-ignore lint/style/noDefaultExport: using default export
export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
