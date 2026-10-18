import type { Metadata } from "next";
import Link from "next/link";
import { ENV } from "../env";
import "../lib/styles/globals.css";

export const metadata: Metadata = {
  title: `404 - Page Not Found | ${ENV.APP_NAME}`,
  description: "お探しのページは見つかりませんでした。",
};

/**
 * 404 for URLs that match no route. It is handled at the routing layer and
 * bypasses the root layout, so it must provide its own `<html>` / `<body>` and
 * global CSS. 404s from `notFound()` are handled by `not-found.tsx`, rendered
 * inside the root layout.
 *
 * @returns An HTML document with the 404 message and a link to the top page
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
