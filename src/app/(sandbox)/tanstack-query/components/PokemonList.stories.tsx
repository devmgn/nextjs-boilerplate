import { getPokemonListHandler } from "@/mocks/handlers/getPokemonListHandler";
import type { Meta, StoryObj } from "@storybook/react";
import { Suspense } from "react";
import { PokemonList } from "./PokemonList";

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

// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
export const Error: Story = {
  parameters: {
    msw: [getPokemonListHandler.error],
  },
};
