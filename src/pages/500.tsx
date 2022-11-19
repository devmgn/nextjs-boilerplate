import { NextPage } from 'next';
import DefaultLayout from '@/components/templates/DefaultLayout';
import Meta from '@/components/templates/Meta';

export const Custom500: NextPage = () => {
  return (
    <DefaultLayout>
      <Meta title="505 Error Page Not Found" />
      <h1>500 | Page Not Found</h1>
    </DefaultLayout>
  );
};

export default Custom500;
