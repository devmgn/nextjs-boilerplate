"use client";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ reset }: ErrorProps) {
  return (
    <html lang="ja">
      <body>
        <h2>Something went wrong! (global-error)</h2>
        <button onClick={reset} type="button">
          Try again
        </button>
      </body>
    </html>
  );
}
