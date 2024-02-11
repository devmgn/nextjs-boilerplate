import { Button } from '@/components/ui/button';
import type { NextPage } from 'next';

const Index: NextPage = () => {
  return (
    <Button asChild>
      <a href="#hoge">hoge</a>
    </Button>
  );
};

Index.displayName = 'Index';

export default Index;
