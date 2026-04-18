import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useId, useRef } from "react";
import { expect, userEvent } from "storybook/test";
import { useLocalStorage } from "./useLocalStorage";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";

function UseLocalStorageDemo() {
  const [value, setValue, removeValue] = useLocalStorage("storybook-demo");
  const inputRef = useRef<HTMLInputElement>(null);
  const valueId = useId();
  const inputId = useId();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <label htmlFor={valueId}>Current Value: </label>
        <Input id={valueId} readOnly value={value ?? "null"} />
      </div>
      <div className="flex gap-2">
        <label htmlFor={inputId}>New Value: </label>
        <Input ref={inputRef} id={inputId} defaultValue="hello" />
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => {
            if (inputRef.current) {
              setValue(inputRef.current.value);
            }
          }}
        >
          Save
        </Button>
        <Button onClick={removeValue}>Remove</Button>
      </div>
    </div>
  );
}

const meta = {
  component: undefined,
  tags: ["!manifest"],
  parameters: {
    layout: "centered",
  },
  render: () => <UseLocalStorageDemo />,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  play: async ({ canvas }) => {
    const [currentValue, newValueInput] = canvas.getAllByRole("textbox");
    await expect(currentValue).toHaveValue("null");

    await userEvent.clear(newValueInput);
    await userEvent.type(newValueInput, "saved-value");

    const [saveButton, removeButton] = canvas.getAllByRole("button");
    await userEvent.click(saveButton);
    await expect(currentValue).toHaveValue("saved-value");

    await userEvent.click(removeButton);
    await expect(currentValue).toHaveValue("null");
  },
};
