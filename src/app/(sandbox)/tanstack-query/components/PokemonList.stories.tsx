import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallbackRender } from '@/components';
import { getPokemonListHandler } from '@/mocks/handlers/getPokemonListHandler';
import { PokemonList } from './PokemonList';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PokemonList> = {
  component: PokemonList,
  decorators: [
    (Story) => (
      <ErrorBoundary fallbackRender={ErrorFallbackRender}>
        <Suspense fallback="loading...">
          <Story />
        </Suspense>
      </ErrorBoundary>
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
