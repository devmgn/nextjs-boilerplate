import Head from 'next/head';
import { Header, Footer } from '@/components/layouts';
import appSettings from 'appSettings';

export type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = (props) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0" />
        <title>{appSettings.siteName}</title>
        <meta name="description" content={appSettings.defaultDescription} />
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <Header />
      <main>{props.children}</main>
      <Footer />
    </>
  );
};

export default Layout;
