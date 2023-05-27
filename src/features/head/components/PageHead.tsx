import Head from 'next/head';
import { APP_NAME, DEFAULT_DESCRIPTION, TITLE_SEPARATOR } from '../config';
import type { SetOptional } from 'type-fest';

type HeadProps = {
  title?: string;
  description?: string;
} & SetOptional<React.ComponentProps<typeof Head>, 'children'>;

const PageHead: React.FC<HeadProps> = ({ title, description, ...props }) => {
  return (
    <Head {...props}>
      <title>{title ? `${title}${TITLE_SEPARATOR}${APP_NAME}` : APP_NAME}</title>
      <meta name="description" content={description ?? DEFAULT_DESCRIPTION} />
    </Head>
  );
};

export default PageHead;
