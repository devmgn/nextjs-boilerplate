import { faker } from '@faker-js/faker/locale/ja';
import { Close } from '@/assets/icons';
import IconButton from '@/components/IconButton';
import SvgIcon from '@/components/SvgIcon';
import Typography from '@/components/Typography';
import Tooltip from '..';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Tooltip> = {
  title: 'components/Tooltip',
  component: Tooltip,
  args: {
    tooltipContent: <Typography>{faker.lorem.paragraph()}</Typography>,
  },
  render: (args) => {
    return (
      <Tooltip {...args}>
        <IconButton>
          <SvgIcon as={Close} />
        </IconButton>
      </Tooltip>
    );
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {};
