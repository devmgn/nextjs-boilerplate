import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { Field } from "./Field";
import { Input } from "../Input";

const meta = {
  component: Field,
  args: {
    render: (props) => <Input {...props} />,
    label: "フィールドラベル",
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const label = canvas.getByText("フィールドラベル");
    const input = canvas.getByRole("textbox");
    await expect(label).toHaveAttribute("for", input.id);
  },
};

export const WithErrorMessage: Story = {
  args: {
    errorMessage: "この項目は必須です。",
  },
  play: async ({ canvas }) => {
    const error = canvas.getByText("この項目は必須です。");
    await expect(error).toBeInTheDocument();

    const input = canvas.getByRole("textbox");
    await expect(input).toHaveClass("text-red-600");
  },
};

export const WithDisabledInput: Story = {
  args: {
    render: (props) => <Input {...props} disabled />,
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox");
    await expect(input).toBeDisabled();
  },
};

export const WithoutLabel: Story = {
  args: {
    label: undefined,
    render: (props) => <Input {...props} aria-label="ラベルなし入力" />,
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox");
    await expect(input).not.toHaveAttribute("id");
  },
};
