import { LazyMotion, domAnimation } from 'framer-motion';
import { Provider } from 'react-redux';
import store from '@/states/store';
import GlobalStyle from '@/styles/GlobalStyle';
import type { AppProps } from 'next/app';

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <Provider store={store}>
    <LazyMotion features={domAnimation}>
      <GlobalStyle />
      <Component {...pageProps} />
    </LazyMotion>
  </Provider>
);

export default App;
