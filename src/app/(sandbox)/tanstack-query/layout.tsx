import { Heading } from '@yamada-ui/react';

const TanstackQueryLayout: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <>
      <Heading size="3xl">Tanstack Query Sandbox</Heading>
      {children}
    </>
  );
};

TanstackQueryLayout.displayName = 'TanstackQueryLayout';

export default TanstackQueryLayout;
