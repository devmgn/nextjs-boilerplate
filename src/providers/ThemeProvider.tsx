import { createContext, useContext, useState } from 'react';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { theme as defaultTheme } from '@/features/styledComponents';
import type { WithChildrenProps } from '@/types';
import type { DefaultTheme } from 'styled-components';

const ThemeContext = createContext<React.Dispatch<React.SetStateAction<DefaultTheme>>>(() => {});

export const useThemeContext = () => useContext(ThemeContext);

const ThemeProvider: React.FC<WithChildrenProps> = ({ children }) => {
  const [theme, setTheme] = useState(defaultTheme);

  return (
    <ThemeContext.Provider value={setTheme}>
      <SCThemeProvider theme={theme}>{children}</SCThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
