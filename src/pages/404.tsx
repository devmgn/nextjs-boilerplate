import { NextPage } from 'next';
import DefaultLayout from '@/components/templates/DefaultLayout';
import Meta from '@/components/templates/Meta';

export const Custom404: NextPage = () => {
  return (
    <DefaultLayout>
      <Meta title="404 Error Page Not Found" />
      <h1>404 | Page Not Found</h1>
    </DefaultLayout>
  );
};

export default Custom404;
