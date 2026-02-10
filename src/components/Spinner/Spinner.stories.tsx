import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Spinner } from "./Spinner";

const meta = {
  component: Spinner,
  args: {
    showTrack: true,
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof Spinner>;

export const PresetSizes: Story = {
  args: {
    size: "md",
  },
  argTypes: {
    size: {
      control: { type: "inline-radio" },
      options: ["sm", "md", "lg", "xl"],
    },
  },
};

export const CustomSize: Story = {
  args: {
    size: 36,
  },
  argTypes: {
    size: {
      control: { type: "number", min: 12, max: 128, step: 4 },
    },
  },
};
