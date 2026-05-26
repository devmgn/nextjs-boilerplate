import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent } from "storybook/test";
import { Input } from "./Input";

const meta = {
  component: Input,
  args: {
    placeholder: "テキストを入力",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: "サンプルテキスト" },
};

export const Error: Story = {
  args: { isError: true, defaultValue: "エラー状態" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "無効な入力" },
};

export const TypeTest: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox");
    await userEvent.type(input, "テスト入力");
    await expect(input).toHaveValue("テスト入力");
  },
};

export const FocusTest: Story = {
  args: { onFocus: fn(), onBlur: fn() },
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole("textbox");
    await userEvent.click(input);
    await expect(args.onFocus).toHaveBeenCalled();
    await userEvent.tab();
    await expect(args.onBlur).toHaveBeenCalled();
  },
};
