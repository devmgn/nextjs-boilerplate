import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import type React from "react";
import { Button } from "../src/components/ui/button";

export const SBErrorBoundary = (
  props: Omit<
    React.ComponentPropsWithoutRef<typeof ErrorBoundary>,
    "errorComponent"
  >,
) => {
  return (
    <ErrorBoundary
      {...props}
      errorComponent={({ error, reset }) => {
        return (
          <>
            <h1 className="font-bold text-2xl">Something went wrong:</h1>
            <p className="mt-4 text-red-600">{error.message}</p>
            <Button className="mt-4" onClick={reset}>
              Try again
            </Button>
          </>
        );
      }}
    />
  );
};
