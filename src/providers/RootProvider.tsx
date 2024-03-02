import './globals.css';
import { QueryClientProvider } from './QueryClientProvider';

export const RootProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <QueryClientProvider>{children}</QueryClientProvider>;
};
