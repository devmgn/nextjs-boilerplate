import DefaultLayout from '@/components/layouts/DefaultLayout';
import Seo from '@/components/layouts/Seo';
import Home from '@/components/templates/Home';
import type { NextPage } from 'next';

const Index: NextPage = () => {
  return (
    <DefaultLayout>
      <Seo />
      <Home />
    </DefaultLayout>
  );
};

export default Index;
