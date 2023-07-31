import { Close } from '@/assets/icons';
import IconButton from '../IconButton';
import SvgIcon from '../SvgIcon';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof IconButton> = {
  title: 'components/IconButton',
  component: IconButton,
  args: {
    children: <SvgIcon as={Close} />,
    'aria-label': '閉じる',
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {};
