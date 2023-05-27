import { CacheProvider, ThemeProvider } from '@emotion/react';
import { GlobalStyles, createEmotionCache, theme } from '@/lib/styles';
import type { AppProps as NextAppProps } from 'next/app';

const createdEmotionCache = createEmotionCache();

export type AppProps = {
  emotionCache?: ReturnType<typeof createEmotionCache>;
} & NextAppProps;

const App: React.FC<AppProps> = ({ emotionCache = createdEmotionCache, Component, pageProps }) => {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;
