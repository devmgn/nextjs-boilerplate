export const getBaseUrl = (path: string) => {
  const url = new URL(path, "https://pokeapi.co/api/v2/");
  return url.toString();
};
