import DefaultLayout from '@/components/layouts/DefaultLayout';
import Meta from '@/components/layouts/Meta';
import Home from '@/components/templates/Home';
import type { NextPage } from 'next';

const Index: NextPage = () => {
  return (
    <DefaultLayout>
      <Meta title="Home" />
      <Home />
    </DefaultLayout>
  );
};

export default Index;
