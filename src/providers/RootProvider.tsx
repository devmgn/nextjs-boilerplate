import { UIProvider } from '@yamada-ui/react';

export const RootProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <UIProvider>{children}</UIProvider>;
};
