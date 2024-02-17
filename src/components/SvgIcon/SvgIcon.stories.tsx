import { expect, fn, userEvent, within } from '@storybook/test';
import { Close } from '@/assets/icons';
import { SvgIcon } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SvgIcon> = {
  component: SvgIcon,
  args: {
    component: Close,
    size: 'md',
    onClick: fn(),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    'data-testid': 'svg-icon',
  },
};

export default meta;
type Story = StoryObj<typeof SvgIcon>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = await canvas.findByTestId('svg-icon');
    await userEvent.click(icon);
    await expect(args.onClick).toHaveBeenCalled();
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
    await expect(icon).toHaveAttribute('focusable', 'false');
  },
};
