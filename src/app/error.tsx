"use client";

interface ErrorProps {
  error: (Error & { digest?: string }) | unknown;
  reset: () => void;
}

export default function ErrorPage(props: ErrorProps) {
  const { reset } = props;

  return (
    <>
      <h2>Something went wrong!</h2>
      <button onClick={reset} type="button">
        Try again
      </button>
    </>
  );
}
