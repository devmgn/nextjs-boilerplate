"use client";

interface ErrorProps {
  error: unknown;
  reset: () => void;
}

/**
 * ルートセグメントで throw された未捕捉エラーを表示し、再試行させるエラー画面。
 *
 * @param props - Next.js が渡すエラーと再レンダリング用の `reset`
 * @returns エラーメッセージと再試行ボタン
 */
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
