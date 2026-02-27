import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { Backdrop } from "./Backdrop";

const meta = {
  component: Backdrop,
  args: {
    open: true,
    blur: true,
  },
  decorators: [
    (story) => (
      <div className="relative h-50 w-full">
        <p>背景コンテンツ。Backdropの後ろに表示されます。</p>
        {story()}
      </div>
    ),
  ],
} satisfies Meta<typeof Backdrop>;

export default meta;
type Story = StoryObj<typeof Backdrop>;

export const Default: Story = {};

export const WithoutBlur: Story = {
  args: { blur: false },
};

export const Closed: Story = {
  args: { open: false },
};

export const OpenStateTest: Story = {
  play: async ({ canvasElement }) => {
    const backdrop = within(canvasElement).getByRole("presentation", {
      hidden: true,
    });
    await expect(backdrop).toHaveAttribute("data-state", "open");
    await expect(backdrop).toHaveAttribute("aria-hidden", "true");
  },
};
