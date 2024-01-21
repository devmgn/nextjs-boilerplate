import { Container } from '@yamada-ui/react';

const SandboxLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Container as="main" maxWidth={1000} marginInline="auto">
      {children}
    </Container>
  );
};

SandboxLayout.displayName = 'SandboxLayout';

export default SandboxLayout;
