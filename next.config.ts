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
    optimizePackageImports: ["@radix-ui/react-icons"],
    requestInsights: true,
    strictRouteTypes: true,
    turbopackPluginRuntimeStrategy: "workerThreads",
    // Turbopack 専用フラグ。Storybook / vitest は Turbopack を通さず next.config.ts を
    // 読むため、無条件に true にすると Next 側の検証で throw する。
    turbopackRustReactCompiler: Boolean(process.env.TURBOPACK),
    typedEnv: true,
    useOffline: true,
  },
  partialPrefetching: true,
  poweredByHeader: false,
  reactCompiler: true,
  typedRoutes: true,
} satisfies NextConfig;

export default nextConfig;
