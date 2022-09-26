import React from 'react';
import Head from 'next/head';
import appSettings from 'appSettings';

type HeadProps = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
};

const {
  meta: { appName, defaultDescription, titleSeparator },
} = appSettings;

const Seo: React.FC<HeadProps> = ({ title, description, children }) => {
  return (
    <Head>
      <title>{title ? `${title}${titleSeparator}${appName}` : appName}</title>
      <meta name="description" content={description ?? defaultDescription} />
      {children}
    </Head>
  );
};

export default Seo;
