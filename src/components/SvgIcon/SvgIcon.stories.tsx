import { FaceIcon } from "@radix-ui/react-icons";
import { expect, fn, userEvent, within } from "storybook/test";
import { SvgIcon } from ".";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof SvgIcon> = {
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
};

export default meta;
type Story = StoryObj<typeof SvgIcon>;

export const Default: Story = {};

export const Test: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = await canvas.findByLabelText("Face icon");
    await userEvent.click(icon);
    await expect(args.onClick).toHaveBeenCalled();
    await expect(icon).toHaveAttribute("aria-hidden", "true");
    await expect(icon).toHaveAttribute("focusable", "false");
  },
};
