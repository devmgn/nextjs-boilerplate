import { Close } from '@/assets/icons';
import ClickAwayListener from '../ClickAwayListener';
import IconButton from '../IconButton';
import SvgIcon from '../SvgIcon';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ClickAwayListener> = {
  title: 'components/ClickAwayListener',
  component: ClickAwayListener,
  args: {
    children: (
      <IconButton>
        <SvgIcon as={Close} />
      </IconButton>
    ),
    onClickAway: (e) => console.log('onClickAway', e),
  },
};

export default meta;
type Story = StoryObj<typeof ClickAwayListener>;

export const Default: Story = {};
