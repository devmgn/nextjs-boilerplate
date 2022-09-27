import { NextPage } from 'next';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import Seo from '@/components/layouts/Seo';

export const Custom500: NextPage = () => {
  return (
    <DefaultLayout>
      <Seo title="505 Error Page Not Found" />
      <h1>500 | Page Not Found</h1>
    </DefaultLayout>
  );
};

export default Custom500;
