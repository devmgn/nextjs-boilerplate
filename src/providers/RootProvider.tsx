'use client';

import { ThemeProvider } from 'styled-components';
import { StyledComponentsRegistry, GlobalStyle, theme } from '@/features/styledComponents';
import type { WithChildrenProps } from '@/types';

const RootProvider: React.FC<WithChildrenProps> = ({ children }) => {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
};

export default RootProvider;
