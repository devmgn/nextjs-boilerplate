import { getPokemonListHandler } from "@/mocks/handlers/getPokemonListHandler";
import type { Meta, StoryObj } from "@storybook/react";
import { PokemonList } from "./pokemonList";

const meta: Meta<typeof PokemonList> = {
  component: PokemonList,
  parameters: {
    msw: {
      handlers: [getPokemonListHandler.success],
    },
  },
};

export default meta;
type Story = StoryObj<typeof PokemonList>;

export const Default: Story = {};

export const FetchError: Story = {
  parameters: {
    msw: {
      handlers: [getPokemonListHandler.error],
    },
  },
};
