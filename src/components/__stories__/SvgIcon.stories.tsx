import { Help } from '@/assets/icons';
import SvgIcon from '../SvgIcon';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SvgIcon> = {
  title: 'components/SvgIcon',
  component: SvgIcon,
  argTypes: {
    fontSize: {
      control: {
        type: 'range',
        min: 10,
        max: 256,
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
        max: 360,
        step: 1,
      },
    },
  },
  args: {
    fontSize: 24,
    rotate: 0,
  },
  render: ({ fontSize, rotate }) => (
    <SvgIcon as={Help} fontSize={`${fontSize ?? 24}px`} rotate={`${rotate ?? 0}deg`} />
  ),
};

export default meta;
type Story = StoryObj<typeof SvgIcon>;

export const Default: Story = {};
