import { QueryClientProvider } from './QueryClientProvider';
import { UIProvider } from './UIProvider';

export const RootProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <QueryClientProvider>
      <UIProvider>{children}</UIProvider>
    </QueryClientProvider>
  );
};

RootProvider.displayName = 'RootProvider';
