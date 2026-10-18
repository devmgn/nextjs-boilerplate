"use client";

import { useState } from "react";
import { ErrorThrower } from "./_components/error-thrower";
import { Button } from "../../../components/button";
import { delay } from "../../../utils/delay";

// Simulates a failing API call that throws.
// React Compiler cannot lower a ThrowStatement inside try/catch, so the throw
// is isolated in a plain function outside the component.
async function requestThatFails(): Promise<never> {
  await delay(1000);
  throw new Error("API request failed: 500 Internal Server Error");
}

/**
 * Sandbox page for checking how render-time and async errors are handled.
 *
 * @returns Buttons that trigger each error, plus the result display
 */
export default function ErrorTestPage() {
  const [shouldError, setShouldError] = useState(false);
  const [asyncError, setAsyncError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsyncError = async () => {
    setIsLoading(true);
    setAsyncError(null);

    try {
      await requestThatFails();
    } catch (error) {
      // Async errors are not caught by ErrorBoundary,
      // so they must be handled explicitly with try-catch
      setAsyncError(Error.isError(error) ? error : new Error("Unknown error"));
    }

    // Equivalent to finally since catch never rethrows.
    // React Compiler cannot lower finally clauses, so this sits after the try/catch.
    setIsLoading(false);
  };

  const handleRenderError = () => {
    setShouldError(true);
  };

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-2xl font-bold">ErrorBoundary Test Page</h1>

      <div className="space-y-4">
        <div className="rounded-lg border border-border p-4">
          <h2 className="mb-2 text-lg font-semibold">
            Render Error (Caught by ErrorBoundary)
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            レンダリング中にエラーを発生させます。ErrorBoundaryがキャッチします。
          </p>
          <Button onClick={handleRenderError}>Trigger Render Error</Button>
          {shouldError && <ErrorThrower />}
        </div>

        <div className="rounded-lg border border-border p-4">
          <h2 className="mb-2 text-lg font-semibold">
            Async Error (Manual Handling)
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            非同期エラーはErrorBoundaryではキャッチされないため、try-catchで処理します。
          </p>
          <Button
            disabled={isLoading}
            onClick={() => {
              void handleAsyncError();
            }}
          >
            {isLoading ? "Loading..." : "Trigger Async Error"}
          </Button>
          {asyncError !== null && (
            <div className="mt-4 rounded border border-m3-error-container bg-m3-error-container p-3">
              <p className="font-medium text-m3-on-error-container">
                Error caught:
              </p>
              <p className="text-sm text-destructive">{asyncError.message}</p>
              <Button
                className="mt-2"
                onClick={() => {
                  setAsyncError(null);
                }}
              >
                Clear Error
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 rounded bg-m3-secondary-container p-4">
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
            <code className="rounded bg-muted px-1">try-catch</code>で処理
          </li>
        </ul>
      </div>
    </div>
  );
}
