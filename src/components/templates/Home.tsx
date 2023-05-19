import { useEffect, useRef, useState } from 'react';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  const [value, setValue] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  const newValue = useDebouncedValue(value, 300, ref);

  useEffect(() => {
    console.log(newValue);
  }, [newValue]);

  return <input value={value} onChange={(e) => setValue(e.currentTarget.value)} ref={ref} />;
};

export default Home;
