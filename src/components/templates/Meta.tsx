import Head from 'next/head';
import { APP_NAME, META } from '@/constants';

type HeadProps = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
};

const Meta: React.FC<HeadProps> = ({ title, description, children }) => {
  return (
    <Head>
      <title>{title ? `${title}${META.TITLE_SEPARATOR}${APP_NAME}` : APP_NAME}</title>
      <meta name="description" content={description ?? META.DEFAULT_DESCRIPTION} />
      {children}
    </Head>
  );
};

export default Meta;
