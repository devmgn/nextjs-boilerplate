import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { LazyMotion, domAnimation } from 'framer-motion';
import store from '@/states/store';
import GlobalStyle from '@/styles/GlobalStyle';

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <Provider store={store}>
    <LazyMotion features={domAnimation}>
      <GlobalStyle />
      <Component {...pageProps} />
    </LazyMotion>
  </Provider>
);

export default App;
