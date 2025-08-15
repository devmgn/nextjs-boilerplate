import { useId } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { useDisclosure } from ".";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof useDisclosure> = {
  title: "hooks/useDisclosure",
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
          <Input id={id} readOnly={true} value={isOpen.toString()} />
        </div>
        <Button onClick={open}>Open</Button>
        <Button onClick={close}>Close</Button>
        <Button onClick={toggle}>Toggle</Button>
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof useDisclosure>;

export const Default: Story = {};

export const Test: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");
    expect(input).toHaveValue("false");
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
