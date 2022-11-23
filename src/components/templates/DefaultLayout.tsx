import Footer from '@/components/organisms/Footer';
import Header from '@/components/organisms/Header';
import DefaultHead from './DefaultHead';

export type DefaultLayoutProps = {
  children: React.ReactNode;
};

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <>
      <DefaultHead />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default DefaultLayout;
