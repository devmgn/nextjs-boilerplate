'use client';

import { Suspense } from 'react';
import { PokemonList } from './PokemonList';

export const TanstackQuerySandbox = () => {
  return (
    <Suspense fallback="loading...">
      <PokemonList />
    </Suspense>
  );
};
