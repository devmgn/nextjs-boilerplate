import { CacheProvider, ThemeProvider } from '@emotion/react';
import createEmotionCache from '@/styles/createEmotionCache';
import GlobalStyle from '@/styles/GlobalStyle';
import theme from '@/styles/theme';
import type { EmotionCache } from '@emotion/react';
import type { AppProps as NextAppProps } from 'next/app';

const clientSideEmotionCache = createEmotionCache();

export type AppProps = { emotionCache?: EmotionCache } & NextAppProps;

const App: React.FC<AppProps> = ({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}) => {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;
