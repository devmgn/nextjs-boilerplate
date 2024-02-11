import React from 'react';
import { Heading, Button, Box, Tag, Stack } from '@yamada-ui/react';
import { ErrorBoundary as NextErrorBoundary } from 'next/dist/client/components/error-boundary';

export const ErrorBoundary: React.FC<
  Omit<
    React.ComponentPropsWithoutRef<typeof NextErrorBoundary>,
    'errorComponent'
  >
> = (props) => {
  return (
    <NextErrorBoundary
      {...props}
      errorComponent={({ error, reset }) => {
        return (
          <Box role="alert">
            <Heading>Something went wrong:</Heading>
            <Stack as="dl" gap="2" mt="2">
              {Object.entries(error).map(([key, value]) => (
                <React.Fragment key={key}>
                  <Tag
                    as="dt"
                    variant="outline"
                    size="sm"
                    alignSelf="flex-start"
                  >
                    {key}
                  </Tag>
                  <Box
                    as="dd"
                    p="2"
                    bgColor="red.50"
                    color="gray.700"
                    borderRadius="8"
                    fontFamily="monospace"
                    wordBreak="break-all"
                  >
                    {JSON.stringify(value)}
                  </Box>
                </React.Fragment>
              ))}
            </Stack>
            <Button mt="4" onClick={reset}>
              Try again
            </Button>
          </Box>
        );
      }}
    />
  );
};

ErrorBoundary.displayName = 'ErrorBoundary';
