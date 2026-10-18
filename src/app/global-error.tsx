"use client";

import "../lib/styles/globals.css";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Last line of defense for uncaught errors thrown in the root layout /
 * template. It replaces the root layout, so it must provide its own `<html>` /
 * `<body>` and global CSS. It must be a Client Component, so `metadata` is
 * unavailable; `<title>` is used instead.
 *
 * @param props - The error passed by Next.js and `reset` to re-render
 * @returns An HTML document with the error message and a retry button
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
