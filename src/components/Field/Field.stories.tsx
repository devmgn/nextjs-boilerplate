import { Input } from "../Input";
import { Field } from ".";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof Field> = {
  component: Field,
  args: {
    children: <Input />,
    label: "Field Label",
    errorMessage: "",
  },
};

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
    children: <Input disabled={true} />,
  },
};
