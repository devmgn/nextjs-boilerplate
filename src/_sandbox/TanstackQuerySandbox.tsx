'use client';

import { Suspense, lazy } from 'react';

const PokemonList = lazy(() =>
  import('./PokemonList').then((m) => ({ default: m.PokemonList })),
);

export const TanstackQuerySandbox = () => {
  return (
    <Suspense fallback="loading...">
      <PokemonList />
    </Suspense>
  );
};
