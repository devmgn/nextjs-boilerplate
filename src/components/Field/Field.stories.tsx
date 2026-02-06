import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Field } from ".";
import { Input } from "../Input";

const meta = {
  component: Field,
  args: {
    children: <Input />,
    label: "Field Label",
    errorMessage: "",
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {};

export const WithErrorMessage: Story = {
  args: {
    errorMessage: "This field is required.",
  },
};

export const WithDisabledInput: Story = {
  args: {
    children: <Input disabled />,
  },
};
