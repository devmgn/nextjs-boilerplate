import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useId, useState } from "react";
import { useDebouncedInput } from "./useDebouncedInput";
import { Input } from "../../components/form/Input";

const meta = {
  component: undefined,
  tags: ["!manifest"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof useDebouncedInput>;

export default meta;
type Story = StoryObj<typeof useDebouncedInput>;

/** IME 対応の debounced 入力。変換中の中間入力は流さず、確定時に即時反映する。 */
export const Default: Story = {
  render: () => {
    const [delayTime, setDelayTime] = useState(300);
    const [result, setResult] = useState("");

    const handlers = useDebouncedInput(setResult, delayTime);

    const resultId = useId();
    const delayTimeId = useId();

    return (
      <div className="flex flex-col gap-4">
        <Input {...handlers} placeholder="input text (IME 対応)" />
        <div className="grid grid-cols-[1fr_auto] items-center gap-2">
          <label htmlFor={resultId}>debounced result: </label>
          <Input id={resultId} readOnly value={result} />
          <label htmlFor={delayTimeId}>delay (ms)</label>
          <Input
            id={delayTimeId}
            onChange={(e) => {
              setDelayTime(e.target.valueAsNumber);
            }}
            placeholder="delay time"
            type="number"
            value={delayTime}
          />
        </div>
      </div>
    );
  },
};
