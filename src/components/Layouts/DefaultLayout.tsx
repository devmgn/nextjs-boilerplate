import Footer from '../Footer';
import Header from '../Header';

export type DefaultLayoutProps = {
  children: React.ReactNode;
};

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default DefaultLayout;
