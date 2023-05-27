import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Typography from '@/components/Typography';
import { PageHead } from '@/features/head';
import type { NextPage } from 'next';

const Index: NextPage = () => {
  return (
    <>
      <PageHead title="title">
        <meta property="og:title" content="ChatGPT" />
      </PageHead>
      <DefaultLayout>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos cumque mollitia
          nihil rem eum, repellendus totam necessitatibus animi magnam iure, voluptate beatae autem.
          Molestias eveniet error non laborum totam pariatur!
        </Typography>
      </DefaultLayout>
    </>
  );
};

export default Index;
