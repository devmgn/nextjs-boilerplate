'use client';

import { ThemeProvider as ScThemeProvider } from 'styled-components';
import { theme } from '../lib';

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <ScThemeProvider theme={theme}>{children}</ScThemeProvider>;
};

export default ThemeProvider;
