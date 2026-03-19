import type { NextConfig } from "next";

const nextConfig = {
  compiler: {
    reactRemoveProperties: true,
  },
  experimental: {
    authInterrupts: true,
    strictRouteTypes: true,
    turbopackFileSystemCacheForDev: true,
    viewTransition: true,
  },
  poweredByHeader: false,
  reactCompiler: true,
  typedRoutes: true,
} satisfies NextConfig;

export default nextConfig;
