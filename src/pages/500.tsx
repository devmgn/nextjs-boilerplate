import { NextPage } from 'next';
import { Head } from '@/components/layouts/';

export const Custom500: NextPage = () => {
  return (
    <>
      <Head title="505 Error Page Not Found" />
      <h1>500 | Page Not Found</h1>
    </>
  );
};

export default Custom500;
