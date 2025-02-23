import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { useDebouncedCallback } from ".";
import { Input } from "../../components/Input";
import { useIsComposing } from "../useIsComposing";

const meta: Meta<typeof useDebouncedCallback> = {
  title: "hooks/useDebouncedCallback",
  parameters: {
    layout: "centered",
  },
  render: () => {
    const [delayTime, setDelayTime] = useState(250);
    const [result, setResult] = useState("");

    const isComposing = useIsComposing();

    const onChange = useDebouncedCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isComposing) {
          return;
        }
        setResult(e.target.value);
      },
      delayTime,
    );

    return (
      <div
        className="flex flex-col gap-4"
        onCompositionEnd={(e) => console.log(e)}
      >
        <div className="grid grid-cols-[1fr_auto] items-center gap-2">
          <p>debouncedValue Result: </p>
          <Input readOnly={true} value={result} />
          <p>DelayTime</p>
          <Input
            onChange={(e) => setDelayTime(+e.target.value)}
            placeholder="delay time"
            type="number"
            value={delayTime}
          />
        </div>
        <Input onChange={onChange} />
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof useDebouncedCallback>;

export const Default: Story = {};
