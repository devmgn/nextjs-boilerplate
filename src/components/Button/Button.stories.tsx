import { faker } from '@faker-js/faker/locale/ja';
import { Button } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Button> = {
  title: 'components/Button',
  component: Button,
  args: {
    children: faker.lorem.paragraph(),
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};
