import { faker } from '@faker-js/faker/locale/ja';
import Dialog from '../Dialog';
import Typography from '../Typography';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Dialog> = {
  title: 'components/Dialog',
  component: Dialog,
  args: {
    children: <Typography>{faker.lorem.paragraph()}</Typography>,
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {};
