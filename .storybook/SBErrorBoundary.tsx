import React from 'react';
import { Button } from '../src/components/ui/button';
import { ErrorBoundary } from 'next/dist/client/components/error-boundary';

export const SBErrorBoundary: React.FC<
  Omit<React.ComponentPropsWithoutRef<typeof ErrorBoundary>, 'errorComponent'>
> = (props) => {
  return (
    <ErrorBoundary
      {...props}
      errorComponent={({ error, reset }) => {
        return (
          <>
            <h1 className="text-2xl font-bold">Something went wrong:</h1>
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

SBErrorBoundary.displayName = 'SBErrorBoundary';
