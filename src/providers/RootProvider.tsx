import { UIProvider } from './UIProvider';

export const RootProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <UIProvider>{children}</UIProvider>;
};
