import { Box, Button, Heading, Text } from '@yamada-ui/react';
import type { FallbackProps } from 'react-error-boundary';

export const ErrorFallbackRender: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <Box role="alert">
      <Heading>Something went wrong:</Heading>
      <Text>{error.message}</Text>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </Box>
  );
};

ErrorFallbackRender.displayName = 'ErrorFallbackRender';
