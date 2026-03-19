import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FaceIcon } from "@radix-ui/react-icons";
import { expect, fn, userEvent } from "storybook/test";
import { SvgIcon } from "./SvgIcon";

const meta = {
  component: SvgIcon,
  args: {
    icon: FaceIcon,
    label: "Face icon",
    size: "md",
    onClick: fn(),
  },
  argTypes: {
    size: {
      options: ["xs", "sm", "md", "lg", "xl"],
      control: { type: "inline-radio" },
    },
  },
} satisfies Meta<typeof SvgIcon>;

export default meta;
type Story = StoryObj<typeof SvgIcon>;

export const Default: Story = {};

export const ExtraSmall: Story = {
  args: { size: "xs" },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const ExtraLarge: Story = {
  args: { size: "xl" },
};

export const Decorative: Story = {
  args: { label: undefined },
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector("svg");
    await expect(icon).toHaveAttribute("aria-hidden", "true");
  },
};

export const ClickTest: Story = {
  play: async ({ args, canvas }) => {
    const icon = canvas.getByRole("img", { name: "Face icon" });
    await userEvent.click(icon);
    await expect(args.onClick).toHaveBeenCalled();
    await expect(icon).toHaveAttribute("aria-hidden", "false");
    await expect(icon).toHaveAttribute("focusable", "false");
  },
};
