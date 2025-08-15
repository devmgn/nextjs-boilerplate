import { useId, useState } from "react";
import { Input } from "../../components/Input";
import { useIsComposing } from "../useIsComposing";
import { useDebouncedCallback } from ".";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof useDebouncedCallback> = {
  title: "hooks/useDebouncedCallback",
  parameters: {
    layout: "centered",
  },
  render: () => {
    const [delayTime, setDelayTime] = useState(250);
    const [result, setResult] = useState("");

    const resultId = useId();
    const delayTimeId = useId();

    const isComposing = useIsComposing();

    const onChange = useDebouncedCallback(
      (
        e:
          | React.ChangeEvent<HTMLInputElement>
          | React.CompositionEvent<HTMLInputElement>,
      ) => {
        if (!isComposing && e.target instanceof HTMLInputElement) {
          setResult(e.target.value);
        }
      },
      delayTime,
    );

    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[1fr_auto] items-center gap-2">
          <label htmlFor={resultId}>debouncedValue Result: </label>
          <Input id={resultId} readOnly={true} value={result} />
          <label htmlFor={delayTimeId}>DelayTime</label>
          <Input
            id={delayTimeId}
            onChange={(e) => setDelayTime(Number(e.target.value))}
            placeholder="delay time"
            type="number"
            value={delayTime}
          />
        </div>
        <Input
          onChange={onChange}
          onCompositionEnd={(e) => {
            onChange(e);
            onChange.flush();
          }}
          placeholder="input text"
        />
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof useDebouncedCallback>;

export const Default: Story = {};
