import type { Meta, StoryObj } from "@storybook/react";
import { Input } from ".";

const meta: Meta<typeof Input> = {
  component: Input,
  args: {},
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};
