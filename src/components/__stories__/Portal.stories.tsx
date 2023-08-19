import { faker } from '@faker-js/faker/locale/ja';
import Portal from '../Portal';
import Typography from '../Typography';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Portal> = {
  title: 'components/Portal',
  component: Portal,
  args: {
    disablePortal: false,
    children: <Typography>{faker.lorem.paragraph()}</Typography>,
  },
};

export default meta;
type Story = StoryObj<typeof Portal>;

export const Default: Story = {};
