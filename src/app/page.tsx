import { Help } from '@/assets/icons';
import SvgIcon from '@/components/SvgIcon';
import Typography from '@/components/Typography';
import type { NextPage } from 'next';

const Index: NextPage = () => {
  return (
    <Typography>
      <SvgIcon as={Help} />
      hoge
    </Typography>
  );
};

export default Index;
