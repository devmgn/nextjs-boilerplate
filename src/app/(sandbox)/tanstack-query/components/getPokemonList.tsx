import axios from 'axios';

export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
};

export type Pokemon = {
  name: string;
  url: string;
};

export const queryKey = ['fetchPokemonList'];

export const queryFn = () =>
  axios
    .get<PokemonListResponse>('https://pokeapi.co/api/v2/pokemon', {
      params: { limit: 32 },
    })
    .then((res) => res.data);
