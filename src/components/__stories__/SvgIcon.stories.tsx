import { faker } from '@faker-js/faker';
import * as icons from '@/assets/icons';
import SvgIcon from '../SvgIcon';
import type { Meta, StoryObj } from '@storybook/react';

const Icons = Object.values(icons);

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    as: Object.values(Icons)[faker.number.int({ min: 0, max: Icons.length - 1 })],
  },
};

export default meta;
type Story = StoryObj<typeof SvgIcon>;

export const Default: Story = {};
