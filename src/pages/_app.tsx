import { Provider } from 'react-redux';
import { createTheme } from 'styled-breakpoints';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from '@/components/foundation/GlobalStyle';
import { Layout } from '@/components/layouts';
import { store } from '@/states/store';
import type { AppProps } from 'next/app';

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
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Layout>
          <GlobalStyle />
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
