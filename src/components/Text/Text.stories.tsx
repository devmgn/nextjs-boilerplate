import { faker } from '@faker-js/faker/locale/ja';
import { Text } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Text> = {
  title: 'components/Text',
  component: Text,
  args: {
    children: faker.lorem.paragraph(),
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {};
