import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { createTheme } from 'styled-breakpoints';
import { Layout } from '@/components/layouts';
import GlobalStyle from '@/components/foundation/GlobalStyle';

const theme = createTheme({
  xs: '0px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1400px',
});

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <GlobalStyle />
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
};

export default App;
