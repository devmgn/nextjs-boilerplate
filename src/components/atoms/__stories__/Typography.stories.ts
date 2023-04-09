import { faker } from '@faker-js/faker/locale/ja';
import Typography from '../Typography';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Typography> = {
  title: 'atoms/Typography',
  component: Typography,
  args: {
    children: faker.lorem.paragraph(),
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Default: Story = {};
