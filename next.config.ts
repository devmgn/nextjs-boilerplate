import type { NextConfig } from "next";

const nextConfig = {
  cacheComponents: true,
  compiler: {
    reactRemoveProperties: true,
  },
  experimental: {
    authInterrupts: true,
    cachedNavigations: true,
    globalNotFound: true,
    inlineCss: true,
    requestInsights: true,
    strictRouteTypes: true,
    // Turbopack-only flag. Storybook / vitest read next.config.ts without going through
    // Turbopack, so setting it to true unconditionally makes Next's validation throw.
    turbopackRustReactCompiler: Boolean(process.env.TURBOPACK),
    typedEnv: true,
    useOffline: true,
  },
  partialPrefetching: true,
  poweredByHeader: false,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  typedRoutes: true,
} satisfies NextConfig;

export default nextConfig;
