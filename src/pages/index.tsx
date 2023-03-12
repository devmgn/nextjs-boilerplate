import type { NextPage } from 'next';
import DefaultLayout from '@/components/templates/DefaultLayout';
import Home from '@/components/templates/Home';
import Meta from '@/components/templates/Meta';
import wrapper from '@/states/store';
import { setUserName } from '@/states/user/slice';

const Index: NextPage = (props) => {
  wrapper.useHydration(props);

  return (
    <DefaultLayout>
      <Meta title="Home" />
      <Home />
    </DefaultLayout>
  );
};

Index.getInitialProps = wrapper.getInitialPageProps((store) => () => {
  store.dispatch(setUserName('ユーザー名テスト'));

  return {
    props: {},
  };
});

export default Index;
