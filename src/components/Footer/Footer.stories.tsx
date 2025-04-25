import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Footer } from ".";

const meta: Meta<typeof Footer> = {
  component: Footer,
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {};
