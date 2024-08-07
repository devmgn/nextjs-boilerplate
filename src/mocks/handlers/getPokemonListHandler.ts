import { http, HttpResponse, delay } from "msw";
import { pokemonListResponse } from "../api/pokemonListResponse";
import { getBaseUrl } from "../getBaseUrl";

export const getPokemonListHandler = {
  success: http.get(getBaseUrl("pokemon"), async () => {
    await delay(500);
    return HttpResponse.json(pokemonListResponse);
  }),
  error: http.get(getBaseUrl("pokemon"), async () => {
    await delay(500);
    return new HttpResponse("Internal Server Error", { status: 500 });
  }),
};
