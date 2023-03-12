import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import { LazyMotion, domAnimation } from 'framer-motion';
import wrapper from '@/states/store';
import createEmotionCache from '@/styles/createEmotionCache';
import GlobalStyle from '@/styles/GlobalStyle';
import theme from '@/styles/theme';
import type { EmotionCache } from '@emotion/react';

const clientSideEmotionCache = createEmotionCache();

export interface IAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const App: React.FC<IAppProps> = ({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}) => {
  const store = wrapper.useStore();

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <LazyMotion features={domAnimation}>
            <GlobalStyle />
            <Component {...pageProps} />
          </LazyMotion>
        </ThemeProvider>
      </CacheProvider>
    </Provider>
  );
};

export default App;
