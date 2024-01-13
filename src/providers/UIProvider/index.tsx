'use client';

import { UIProvider as YamadaUIProvider } from '@yamada-ui/react';
import { customConfig, customTheme } from './config';

export const UIProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <YamadaUIProvider config={customConfig} theme={customTheme}>
      {children}
    </YamadaUIProvider>
  );
};

UIProvider.displayName = 'UIProvider';
