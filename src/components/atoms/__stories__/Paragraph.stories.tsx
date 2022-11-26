import { faker } from '@faker-js/faker/locale/ja';
import Paragraph from '../Paragraph';
import type { Meta, StoryObj } from '@storybook/react';

export default {
  title: 'atoms/Paragraph',
  component: Paragraph,
} as Meta<typeof Paragraph>;

export const Default: StoryObj<typeof Paragraph> = {
  args: {
    children: faker.lorem.paragraph(),
  },
};
