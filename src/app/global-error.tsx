"use client";

import "../lib/styles/globals.css";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Root layout / template で throw された未捕捉エラーの最終防衛線。root layout を
 * 置き換えるため、`<html>` / `<body>` と global CSS を自前で用意する必要がある。
 * Client Component 必須なので `metadata` は使えず、`<title>` で代替する。
 */
export default function GlobalError(props: ErrorProps) {
  const { reset } = props;

  return (
    <html lang="ja">
      <body className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background text-foreground">
        <title>Something went wrong</title>
        <h2 className="text-headline-lg">
          Something went wrong! (global-error)
        </h2>
        <button
          className="rounded-full bg-primary px-6 py-2 text-label-lg text-primary-foreground"
          onClick={reset}
          type="button"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
