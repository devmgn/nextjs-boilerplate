import { TanstackQueryProvider } from './TanstackQueryProvider';
import { UIProvider } from './UIProvider';

export const RootProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <TanstackQueryProvider>
      <UIProvider>{children}</UIProvider>
    </TanstackQueryProvider>
  );
};

RootProvider.displayName = 'RootProvider';
