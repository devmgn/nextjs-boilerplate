import { faker } from '@faker-js/faker/locale/ja';
import { sprinkles } from '@/config';
import { Button } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Button> = {
  title: 'components/Button',
  component: Button,
  args: {
    children: faker.lorem.word(),
    variants: {
      rounded: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {};
export const AsChild: Story = {
  render: (args) => (
    <Button {...args} asChild className={sprinkles({ mx: 'auto' })}>
      <a href="_">{args.children}</a>
    </Button>
  ),
};
