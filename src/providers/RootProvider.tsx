import { QueryClientProvider } from './QueryClientProvider';

export const RootProvider = ({ children }: React.PropsWithChildren) => {
  return <QueryClientProvider>{children}</QueryClientProvider>;
};
