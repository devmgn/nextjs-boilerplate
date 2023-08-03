import { faker } from '@faker-js/faker/locale/ja';
import { useToggle } from 'react-use';
import { Close } from '@/assets/icons';
import IconButton from '../IconButton';
import Popper from '../Popper';
import SvgIcon from '../SvgIcon';
import Typography from '../Typography';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Popper> = {
  title: 'components/Popper',
  component: Popper,
  args: {
    popperContent: <Typography>{faker.lorem.word()}</Typography>,
  },
  render: (args) => {
    const [open, toggle] = useToggle(false);
    return (
      <Popper {...args} cssTransitionProps={{ in: open }}>
        <IconButton onClick={toggle}>
          <SvgIcon as={Close} />
        </IconButton>
      </Popper>
    );
  },
};

export default meta;
type Story = StoryObj<typeof Popper>;

export const Default: Story = {};
