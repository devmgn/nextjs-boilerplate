import { Note } from '@/assets/icons';
import { SvgIcon } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SvgIcon> = {
  title: 'components/SvgIcon',
  component: SvgIcon,
  args: {
    children: <Note />,
    label: 'svgIcon',
    variants: {},
  },
};

export default meta;

type Story = StoryObj<typeof SvgIcon>;

export const Default: Story = {};
