"use client";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorProps) {
  return (
    <>
      <h2>Something went wrong!</h2>
      <button onClick={reset} type="button">
        Try again
      </button>
    </>
  );
}
