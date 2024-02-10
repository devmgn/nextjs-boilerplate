import { HttpResponse, delay, http } from 'msw';
import { pokemonListResponse } from '../api/pokemonListResponse';

export const getPokemonListHandler = {
  success: http.get('https://pokeapi.co/api/v2/pokemon', async () => {
    await delay(500);
    return HttpResponse.json(pokemonListResponse);
  }),
  error: http.get('https://pokeapi.co/api/v2/pokemon', async () => {
    await delay(500);
    return new HttpResponse('Internal Server Error', { status: 500 });
  }),
};
