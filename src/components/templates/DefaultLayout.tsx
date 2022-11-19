import Footer from '@/components/organisms/Footer';
import Header from '@/components/organisms/Header';
import DefaultHead from './DefaultHead';

export type DefaultLayoutProps = {
  children: React.ReactNode;
};

const DefaultLayout: React.FC<DefaultLayoutProps> = (props) => {
  return (
    <>
      <DefaultHead />
      <Header />
      <main>{props.children}</main>
      <Footer />
    </>
  );
};

export default DefaultLayout;
