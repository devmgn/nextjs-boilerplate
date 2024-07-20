import { getPokemonListHandler } from "@/mocks/handlers/getPokemonListHandler";
import type { Meta, StoryObj } from "@storybook/react";
import { Suspense } from "react";
import { PokemonList } from "./pokemonList";

const meta: Meta<typeof PokemonList> = {
  component: PokemonList,
  decorators: [
    (Story) => (
      <Suspense fallback="loading...">
        <Story />
      </Suspense>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PokemonList>;

export const Default: Story = {
  parameters: {
    msw: [getPokemonListHandler.success],
  },
};

export const FetchError: Story = {
  parameters: {
    msw: [getPokemonListHandler.error],
  },
};
