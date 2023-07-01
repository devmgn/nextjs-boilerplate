import Backdrop from '../Backdrop';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Backdrop> = {
  title: 'components/Backdrop',
  component: Backdrop,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Backdrop>;

export const Default: Story = {};
