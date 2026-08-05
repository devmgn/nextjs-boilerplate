import type { Metadata } from "next";
import Link from "next/link";
import { ENV } from "../env";
import "../lib/styles/globals.css";

export const metadata: Metadata = {
  title: `404 - Page Not Found | ${ENV.APP_NAME}`,
  description: "お探しのページは見つかりませんでした。",
};

/**
 * どのルートにもマッチしない URL の 404。ルーティング層で処理され root layout を
 * 経由しないため、`<html>` / `<body>` と global CSS を自前で用意する必要がある。
 * `notFound()` 由来の 404 は root layout 内でレンダリングされる `not-found.tsx` が担当する。
 */
export default function GlobalNotFound() {
  return (
    <html lang="ja">
      <body className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background text-foreground">
        <h1 className="text-headline-lg">404 - Page Not Found</h1>
        <p className="text-body-md text-muted-foreground">
          お探しのページは見つかりませんでした。
        </p>
        <Link className="text-body-md text-primary underline" href="/">
          トップへ戻る
        </Link>
      </body>
    </html>
  );
}
