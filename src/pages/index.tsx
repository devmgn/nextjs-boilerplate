import Home from '@/components/templates/Home';
import DefaultLayout from '@/layouts/DefaultLayout';
import Seo from '@/layouts/Seo';
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
