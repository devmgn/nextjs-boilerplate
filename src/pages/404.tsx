import { NextPage } from 'next';
import DefaultLayout from '@/layouts/DefaultLayout';
import Seo from '@/layouts/Seo';

export const Custom404: NextPage = () => {
  return (
    <DefaultLayout>
      <Seo title="404 Error Page Not Found" />
      <h1>404 | Page Not Found</h1>
    </DefaultLayout>
  );
};

export default Custom404;
