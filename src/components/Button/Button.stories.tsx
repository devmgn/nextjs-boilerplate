import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent } from "storybook/test";
import { Button } from "./Button";

const meta = {
  component: Button,
  args: {
    children: "Button",
    onClick: fn(),
  },
  argTypes: {
    variant: {
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
      control: { type: "inline-radio" },
    },
    size: {
      options: ["default", "sm", "lg", "icon"],
      control: { type: "inline-radio" },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Destructive: Story = {
  args: { variant: "destructive" },
};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const Secondary: Story = {
  args: { variant: "secondary" },
};

export const Ghost: Story = {
  args: { variant: "ghost" },
};

export const Link: Story = {
  args: { variant: "link" },
};

export const SmallSize: Story = {
  args: { size: "sm" },
};

export const LargeSize: Story = {
  args: { size: "lg" },
};

export const IconSize: Story = {
  args: { size: "icon", children: "✕" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const ClickTest: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button"));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const DisabledClickTest: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button");
    await expect(button).toBeDisabled();
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
