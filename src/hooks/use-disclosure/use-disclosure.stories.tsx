import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useId } from "react";
import { expect, userEvent } from "storybook/test";
import { useDisclosure } from "./use-disclosure";
import { Button } from "../../components/button";
import { Input } from "../../components/form/input";

function UseDisclosureDemo() {
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
}

const meta = {
  component: UseDisclosureDemo,
  tags: ["!manifest"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof UseDisclosureDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

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
