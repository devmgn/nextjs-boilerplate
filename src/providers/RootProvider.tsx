import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import '@/config/css/global.css';

const RootProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <Theme isRoot>{children}</Theme>;
};

export default RootProvider;
