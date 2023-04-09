import { Help } from '@/assets/icons';
import SvgIcon from '../SvgIcon';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SvgIcon> = {
  title: 'atoms/SvgIcon',
  component: SvgIcon,
  argTypes: {
    fontSize: {
      control: {
        type: 'range',
        min: 10,
        max: 64,
        step: 1,
      },
    },
    color: {
      control: 'color',
    },
    rotate: {
      control: {
        type: 'range',
        min: 0,
        max: 359,
        step: 1,
      },
    },
  },
  args: {
    as: Help,
  },
};

export default meta;
type Story = StoryObj<typeof SvgIcon>;

export const Default: Story = {};
