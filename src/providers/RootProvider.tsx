import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import '@/config/css/global.css';
import '@/config/css/theme.config.css';

const RootProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <Theme>{children}</Theme>;
};

export default RootProvider;
