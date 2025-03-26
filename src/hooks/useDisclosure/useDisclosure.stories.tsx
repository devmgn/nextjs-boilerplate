import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { useDisclosure } from ".";

const meta: Meta<typeof useDisclosure> = {
  title: "hooks/useDisclosure",
  parameters: {
    layout: "centered",
  },
  render: () => {
    const { isOpen, open, close, toggle } = useDisclosure();

    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <p>disclosure Result: </p>
          <Input readOnly={true} value={isOpen.toString()} />
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
