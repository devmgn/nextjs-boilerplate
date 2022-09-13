import { LazyMotion, domAnimation } from 'framer-motion';
import { Provider } from 'react-redux';
import { createTheme } from 'styled-breakpoints';
import { ThemeProvider } from 'styled-components';
import { Layout } from '@/components/layouts';
import { store } from '@/states/store';
import { GlobalStyle } from '@/styles';
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
        <LazyMotion features={domAnimation}>
          <Layout>
            <GlobalStyle />
            <Component {...pageProps} />
          </Layout>
        </LazyMotion>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
