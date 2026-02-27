import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useId } from "react";
import { expect, userEvent } from "storybook/test";
import { useDisclosure } from "./useDisclosure";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";

const meta = {
  parameters: {
    layout: "centered",
  },
  render: () => {
    const { isOpen, open, close, toggle } = useDisclosure();
    const id = useId();

    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <label htmlFor={id}>disclosure Result: </label>
          <Input id={id} readOnly value={isOpen.toString()} />
        </div>
        <Button onClick={open}>Open</Button>
        <Button onClick={close}>Close</Button>
        <Button onClick={toggle}>Toggle</Button>
      </div>
    );
  },
} satisfies Meta<typeof useDisclosure>;

export default meta;
type Story = StoryObj<typeof useDisclosure>;

export const Default: Story = {};

export const InteractionTest: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox");
    await expect(input).toHaveValue("false");
    const [openButton, closeButton, toggleButton] =
      canvas.getAllByRole("button");
    await userEvent.click(openButton);
    await expect(input).toHaveValue("true");
    await userEvent.click(closeButton);
    await expect(input).toHaveValue("false");
    await userEvent.click(toggleButton);
    await expect(input).toHaveValue("true");
    await userEvent.click(toggleButton);
    await expect(input).toHaveValue("false");
  },
};
