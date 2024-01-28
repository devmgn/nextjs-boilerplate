import { Container, Heading } from '@yamada-ui/react';

const TanstackQueryLayout: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <Container as="main" maxWidth={1000} marginInline="auto">
      <Heading size="3xl">Tanstack Query Sandbox</Heading>
      {children}
    </Container>
  );
};

TanstackQueryLayout.displayName = 'TanstackQueryLayout';

export default TanstackQueryLayout;
