import { APP_NAME, DEFAULT_DESCRIPTION } from '../config';

const DefaultHead: React.FC = () => {
  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0" />
      <title>{APP_NAME}</title>
      <meta name="description" content={DEFAULT_DESCRIPTION} />
      <link rel="icon" href="/images/favicon.ico" />
    </>
  );
};

export default DefaultHead;
