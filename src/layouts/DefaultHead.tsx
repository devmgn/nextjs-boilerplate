import Head from 'next/head';
import appSettings from 'appSettings';

const DefaultHead = () => {
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0" />
      <title>{appSettings.meta.appName}</title>
      <meta name="description" content={appSettings.meta.defaultDescription} />
      <link rel="icon" href="/images/favicon.ico" />
    </Head>
  );
};

export default DefaultHead;
