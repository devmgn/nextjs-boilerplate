import { CacheProvider, ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
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
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;
