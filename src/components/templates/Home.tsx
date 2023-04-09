import { Help } from '@/assets/icons';
import SvgIcon from '../atoms/SvgIcon';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  return <SvgIcon as={Help} fontSize={100} />;
};

export default Home;
