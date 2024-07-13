"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { usePokemonList } from "./usePokemonList";

export function PokemonList(props: React.ComponentProps<"div">) {
  const {
    query: {
      data: { previous, next, count, results },
    },
    isPending,
    navigateTo,
  } = usePokemonList();

  return (
    <div {...props}>
      <div className="flex items-center gap-2">
        <Button
          disabled={!previous || isPending}
          onClick={() => {
            navigateTo(previous);
          }}
        >
          Prev
        </Button>
        <Button
          disabled={!next || isPending}
          onClick={() => {
            navigateTo(next);
          }}
        >
          Next
        </Button>
        {isPending && <Spinner />}
      </div>
      <p className="prose mt-2">Results: {count}</p>
      <ul className="mt-2 grid grid-cols-[repeat(auto-fit,minmax(198px,1fr))] gap-4">
        {results.map(({ name, url }) => (
          <Card key={url}>
            <CardHeader>{name}</CardHeader>
          </Card>
        ))}
      </ul>
    </div>
  );
}
