import DefaultLayout from '@/components/templates/DefaultLayout';
import Home from '@/components/templates/Home';
import type { NextPage } from 'next';

const Index: NextPage = () => {
  return (
    <DefaultLayout>
      <Home />
    </DefaultLayout>
  );
};

export default Index;
