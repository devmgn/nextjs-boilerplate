'use client';

import {
  GlobalStyle,
  StyledComponentsRegistry,
} from '@/features/styledComponents';
import ThemeProvider from './ThemeProvider';

const RootProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
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
