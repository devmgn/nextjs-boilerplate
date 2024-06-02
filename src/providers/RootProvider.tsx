import { QueryClientProvider } from './QueryClientProvider';

export function RootProvider({ children }: React.PropsWithChildren) {
  return <QueryClientProvider>{children}</QueryClientProvider>;
}
