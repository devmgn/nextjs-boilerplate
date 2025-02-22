import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { useDebouncedValue } from ".";
import { Input } from "../../components/Input";

const meta: Meta<typeof useDebouncedValue> = {
  title: "hooks/useDebouncedValue",
  parameters: {
    layout: "centered",
  },
  render: () => {
    const [delayTime, setDelayTime] = useState(250);
    const [input, setInput] = useState("");

    const debouncedValue = useDebouncedValue(input, delayTime);

    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[1fr_auto] items-center gap-2">
          <p>debouncedValue Result: </p>
          <Input readOnly={true} value={debouncedValue} />
          <p>delay</p>
          <Input
            onChange={(e) => setDelayTime(+e.target.value)}
            placeholder="delay time"
            type="number"
            value={delayTime}
          />
        </div>
        <Input
          onChange={(e) => setInput(e.target.value)}
          placeholder="input value"
          value={input}
        />
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof useDebouncedValue>;

export const Default: Story = {};
