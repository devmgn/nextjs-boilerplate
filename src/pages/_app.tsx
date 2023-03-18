import { CacheProvider, ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { LazyMotion, domAnimation } from 'framer-motion';
import createEmotionCache from '@/styles/createEmotionCache';
import theme from '@/styles/theme';
import type { EmotionCache } from '@emotion/react';
import type { AppProps as NextAppProps } from 'next/app';

const clientSideEmotionCache = createEmotionCache();

export type AppProps = NextAppProps & { emotionCache?: EmotionCache };

const App: React.FC<AppProps> = ({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}) => {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <LazyMotion features={domAnimation}>
          <CssBaseline />
          <Component {...pageProps} />
        </LazyMotion>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;
