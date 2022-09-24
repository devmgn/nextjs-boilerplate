import { NextPage } from 'next';
import { Head } from '@/components/layouts/';

export const Custom404: NextPage = () => {
  return (
    <>
      <Head title="404 Error Page Not Found" />
      <h1>404 | Page Not Found</h1>
    </>
  );
};

export default Custom404;
