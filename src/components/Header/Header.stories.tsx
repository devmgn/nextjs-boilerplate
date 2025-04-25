import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Header } from ".";

const meta: Meta<typeof Header> = {
  component: Header,
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {};
