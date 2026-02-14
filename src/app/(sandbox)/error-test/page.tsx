"use client";

import { useState } from "react";
import { Button } from "../../../components/Button";

export default function ErrorTestPage() {
  const [shouldError, setShouldError] = useState(false);
  const [asyncError, setAsyncError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (shouldError) {
    throw new Error("This is a test error to demonstrate ErrorBoundary!");
  }

  const handleAsyncError = async () => {
    setIsLoading(true);
    setAsyncError(null);

    try {
      // 実際のAPI呼び出しをシミュレート
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      throw new Error("API request failed: 500 Internal Server Error");
    } catch (error) {
      // 非同期エラーはErrorBoundaryでキャッチされないため、
      // try-catchで明示的にハンドリングする必要がある
      setAsyncError(Error.isError(error) ? error : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRenderError = () => {
    setShouldError(true);
  };

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-2xl font-bold">ErrorBoundary Test Page</h1>

      <div className="space-y-4">
        <div className="rounded-lg border border-gray-200 p-4">
          <h2 className="mb-2 text-lg font-semibold">
            Render Error (Caught by ErrorBoundary)
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            レンダリング中にエラーを発生させます。ErrorBoundaryがキャッチします。
          </p>
          <Button onClick={handleRenderError}>Trigger Render Error</Button>
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <h2 className="mb-2 text-lg font-semibold">
            Async Error (Manual Handling)
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            非同期エラーはErrorBoundaryではキャッチされないため、try-catchで処理します。
          </p>
          <Button disabled={isLoading} onClick={() => void handleAsyncError()}>
            {isLoading ? "Loading..." : "Trigger Async Error"}
          </Button>
          {asyncError !== null && (
            <div className="mt-4 rounded border border-red-200 bg-red-50 p-3">
              <p className="font-medium text-red-800">Error caught:</p>
              <p className="text-sm text-red-600">{asyncError.message}</p>
              <Button className="mt-2" onClick={() => setAsyncError(null)}>
                Clear Error
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 rounded bg-blue-50 p-4">
        <h3 className="font-medium">ErrorBoundaryの仕組み:</h3>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
          <li>
            <strong>キャッチする:</strong>{" "}
            レンダリング中のエラー、ライフサイクルメソッドのエラー
          </li>
          <li>
            <strong>キャッチしない:</strong>{" "}
            イベントハンドラ、非同期コード、SSR、ErrorBoundary自身のエラー
          </li>
          <li>
            非同期エラーは
            <code className="rounded bg-gray-100 px-1">try-catch</code>で処理
          </li>
        </ul>
      </div>
    </div>
  );
}
