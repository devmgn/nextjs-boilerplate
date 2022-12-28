import { faker } from '@faker-js/faker/locale/ja';
import Paragraph from '../Paragraph';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Paragraph> = {
  title: 'atoms/Paragraph',
  component: Paragraph,
};

export default meta;

export const Default: StoryObj<typeof Paragraph> = {
  args: {
    children: faker.lorem.paragraph(),
  },
};
