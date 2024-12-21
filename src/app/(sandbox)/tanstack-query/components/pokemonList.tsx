"use client";

import { Button } from "../../../../components/Button";
import { Card } from "../../../../components/Card";
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
        {isPending && <span>🔄</span>}
      </div>
      <p className="prose mt-2">Results: {count}</p>
      <ul className="mt-2 grid grid-cols-[repeat(auto-fit,minmax(198px,1fr))] gap-4">
        {results.map(({ name, url }) => (
          <Card key={url}>
            <div>{name}</div>
          </Card>
        ))}
      </ul>
    </div>
  );
}
