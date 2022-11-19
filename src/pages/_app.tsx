import { LazyMotion, domAnimation } from 'framer-motion';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { BREAKPOINTS } from '@/constants';
import { store } from '@/states/store';
import GlobalStyle from '@/styles/GlobalStyle';
import type { AppProps } from 'next/app';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <LazyMotion features={domAnimation}>
        <ThemeProvider theme={BREAKPOINTS}>
          <>
            <GlobalStyle />
            <Component {...pageProps} />
          </>
        </ThemeProvider>
      </LazyMotion>
    </Provider>
  );
};

export default App;
