import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { Field } from "./Field";
import { Input } from "../Input";

const meta = {
  component: Field,
  args: {
    children: <Input id="field-input" />,
    label: "フィールドラベル",
    errorMessage: "",
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {};

export const WithErrorMessage: Story = {
  args: {
    errorMessage: "この項目は必須です。",
  },
};

export const WithDisabledInput: Story = {
  args: {
    children: <Input id="field-input" disabled />,
  },
};

export const ErrorDisplayTest: Story = {
  args: {
    errorMessage: "エラーメッセージ",
  },
  play: async ({ canvas }) => {
    const errorText = canvas.getByText("エラーメッセージ");
    await expect(errorText).toBeInTheDocument();
    const input = canvas.getByRole("textbox");
    await expect(input).toHaveClass("text-red-600");
  },
};
