import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Typography from '@/components/Typography';
import { PageHead } from '@/features/head';
import type { NextPage } from 'next';

export const Custom500: NextPage = () => {
  return (
    <>
      <PageHead title="505 Error Page Not Found" />
      <DefaultLayout>
        <Typography as="h1">500 | Page Not Found</Typography>
      </DefaultLayout>
    </>
  );
};

export default Custom500;
