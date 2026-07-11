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
  typescript: {
    // Next.js 16.2.10 は TypeScript 7 を認識できず、`next build` の型チェック段階で
    // 「typescript がインストールされていない」と誤検出してビルドが失敗する。
    // そのためビルド内の型チェックを無効化し、型チェックは `pnpm typecheck`
    // （next typegen && tsc --noEmit / TS7 では tsc がネイティブコンパイラ）に一元化する。
    // Next.js 側が TS7 に対応したら削除する。
    ignoreBuildErrors: true,
  },
} satisfies NextConfig;

export default nextConfig;
