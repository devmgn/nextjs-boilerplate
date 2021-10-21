import type { AppProps } from 'next/app';
import Layout from '@/components/layouts';
import GlobalStyle from '@/components/foundation/globalStyle';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Layout>
      <GlobalStyle />
      <Component {...pageProps} />
    </Layout>
  );
};

export default App;
