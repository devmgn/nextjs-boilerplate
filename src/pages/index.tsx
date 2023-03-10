import type { NextPage } from 'next';
import DefaultLayout from '@/components/templates/DefaultLayout';
import Home from '@/components/templates/Home';
import Meta from '@/components/templates/Meta';

const Index: NextPage = () => {
  return (
    <DefaultLayout>
      <Meta title="Home" />
      <Home />
    </DefaultLayout>
  );
};

export default Index;
