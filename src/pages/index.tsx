import DefaultLayout from '@/components/templates/DefaultLayout';
import Home from '@/components/templates/Home';
import Meta from '@/components/templates/Meta';
import wrapper from '@/states/store';
import { setUser } from '@/states/user/slice';
import type { NextPage } from 'next';

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
  store.dispatch(
    setUser({
      name: 'ユーザー名',
      id: 100,
    })
  );

  return {
    props: {},
  };
});

export default Index;
