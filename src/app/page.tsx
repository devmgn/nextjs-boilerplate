'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { NextPage } from 'next';

const Index: NextPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');

  const updateQuery = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries())); // -> has to use this form

    if (!query) {
      current.delete('selected');
    } else {
      current.set('selected', query);
    }

    // cast to string
    const search = current.toString();
    // or const query = `${'?'.repeat(search.length && 1)}${search}`;
    const newQuery = search ? `?${search}` : '';

    router.push(`${pathname}${newQuery}`);
  };

  useEffect(() => {
    updateQuery();
  }, [updateQuery]);

  return (
    <input
      onChange={(e) => {
        setQuery(e.target.value);
      }}
    />
  );
};

export default Index;
