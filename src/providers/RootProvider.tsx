'use client';

import { StyledComponentsRegistry, GlobalStyle } from '@/features/styledComponents';
import ThemeProvider from './ThemeProvider';
import type { WithChildrenProps } from '@/types';

const RootProvider: React.FC<WithChildrenProps> = ({ children }) => {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
};

export default RootProvider;
