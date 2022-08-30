import React from 'react';
import { default as NextHead } from 'next/head';
import appSettings from 'appSettings';

type HeadProps = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
};

const Head: React.FC<HeadProps> = (props) => {
  const { title, description } = props;
  const { siteName, titleSeparator } = appSettings;

  return (
    <NextHead>
      <title>{title ? `${title}${titleSeparator}${siteName}` : siteName}</title>
      {description && <meta name="description" content={description} />}
      {props.children}
    </NextHead>
  );
};

export default Head;
