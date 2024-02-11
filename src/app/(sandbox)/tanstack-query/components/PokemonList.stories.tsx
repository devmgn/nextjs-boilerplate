import { Suspense } from 'react';
import { getPokemonListHandler } from '@/mocks/handlers/getPokemonListHandler';
import { PokemonList } from './PokemonList';
import type { Meta, StoryObj } from '@storybook/react';

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

export const Error: Story = {
  parameters: {
    msw: [getPokemonListHandler.error],
  },
};
