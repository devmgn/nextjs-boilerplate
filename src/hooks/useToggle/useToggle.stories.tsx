import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useId } from "react";
import { expect, userEvent } from "storybook/test";
import { useToggle } from "./useToggle";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";

const meta = {
  component: undefined,
  tags: ["!manifest"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const BooleanMode: Story = {
  render: () => {
    const [value, toggle] = useToggle();
    const id = useId();

    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <label htmlFor={id}>boolean value: </label>
          <Input id={id} readOnly value={value.toString()} />
        </div>
        <Button
          onClick={() => {
            toggle();
          }}
        >
          Toggle
        </Button>
        <Button
          onClick={() => {
            toggle(true);
          }}
        >
          Toggle to true
        </Button>
        <Button
          onClick={() => {
            toggle(false);
          }}
        >
          Toggle to false
        </Button>
      </div>
    );
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox");
    await expect(input).toHaveValue("false");
    const [toggleBtn, toggleToTrueBtn, toggleToFalseBtn] =
      canvas.getAllByRole("button");
    await userEvent.click(toggleBtn);
    await expect(input).toHaveValue("true");
    await userEvent.click(toggleToFalseBtn);
    await expect(input).toHaveValue("false");
    await userEvent.click(toggleToTrueBtn);
    await expect(input).toHaveValue("true");
  },
};

export const ArrayMode: Story = {
  render: () => {
    const [theme, toggle] = useToggle(["light", "dark", "system"]);
    const id = useId();

    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <label htmlFor={id}>theme: </label>
          <Input id={id} readOnly value={theme} />
        </div>
        <Button
          onClick={() => {
            toggle();
          }}
        >
          Next
        </Button>
        <Button
          onClick={() => {
            toggle("light");
          }}
        >
          Toggle to light
        </Button>
        <Button
          onClick={() => {
            toggle("dark");
          }}
        >
          Toggle to dark
        </Button>
        <Button
          onClick={() => {
            toggle("system");
          }}
        >
          Toggle to system
        </Button>
      </div>
    );
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox");
    await expect(input).toHaveValue("light");
    const [nextBtn, toggleToLightBtn, toggleToDarkBtn, toggleToSystemBtn] =
      canvas.getAllByRole("button");
    await userEvent.click(nextBtn);
    await expect(input).toHaveValue("dark");
    await userEvent.click(nextBtn);
    await expect(input).toHaveValue("system");
    await userEvent.click(nextBtn);
    await expect(input).toHaveValue("light");
    await userEvent.click(toggleToDarkBtn);
    await expect(input).toHaveValue("dark");
    await userEvent.click(toggleToSystemBtn);
    await expect(input).toHaveValue("system");
    await userEvent.click(toggleToLightBtn);
    await expect(input).toHaveValue("light");
  },
};
