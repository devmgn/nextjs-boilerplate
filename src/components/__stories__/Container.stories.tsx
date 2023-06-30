import { faker } from '@faker-js/faker/locale/ja';
import Container from '../Container';
import Typography from '../Typography';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Container> = {
  title: 'atoms/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    fullWidth: false,
    maxWidth: 960,
    gutter: 16,
    children: <Typography>{faker.lorem.paragraph()}</Typography>,
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {};
