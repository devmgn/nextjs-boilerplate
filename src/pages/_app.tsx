import { LazyMotion, domAnimation } from 'framer-motion';
import { Provider } from 'react-redux';
import { Layout } from '@/components/layouts';
import { store } from '@/states/store';
import { GlobalStyle } from '@/styles';
import type { AppProps } from 'next/app';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <LazyMotion features={domAnimation}>
        <Layout>
          <GlobalStyle />
          <Component {...pageProps} />
        </Layout>
      </LazyMotion>
    </Provider>
  );
};

export default App;
