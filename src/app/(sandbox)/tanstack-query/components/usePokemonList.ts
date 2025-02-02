import { useSuspenseQuery } from "@tanstack/react-query";
import { useActionState } from "react";
import { pokemon } from "../../../../api/queries/pokemon.queries";

export const usePokemonList = () => {
  const extractOffsetFromUrl = (url: string | undefined): number => {
    if (!url) {
      return 0;
    }

    const { searchParams } = new URL(url);
    return Number.parseInt(searchParams.get("offset") ?? "0", 10);
  };

  const navigateAction = (_prev: number, payload: string | undefined) => {
    return extractOffsetFromUrl(payload);
  };

  const [offset, navigateTo, isPending] = useActionState(navigateAction, 0);
  const query = useSuspenseQuery({
    ...pokemon.getPokemonList({ offset }),
  });

  return {
    query,
    isPending,
    navigateTo,
  };
};
