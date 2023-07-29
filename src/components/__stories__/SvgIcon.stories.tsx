import { Help } from '@/assets/icons';
import SvgIcon from '../SvgIcon';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SvgIcon> = {
  title: 'components/SvgIcon',
  component: SvgIcon,
  argTypes: {
    color: {
      control: 'color',
    },
  },
  args: {
    fontSize: 24,
    rotate: 0,
    color: 'black',
    as: Help,
  },
};

export default meta;
type Story = StoryObj<typeof SvgIcon>;

export const Default: Story = {};
