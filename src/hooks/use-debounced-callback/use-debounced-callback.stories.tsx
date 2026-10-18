import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useId, useState } from "react";
import { useDebouncedCallback } from "./use-debounced-callback";
import { Input } from "../../components/form/input";

/**
 * Shared shell for the result display and delay input. Each story plugs its
 * text input into it.
 *
 * @param props - Result to display, delay and its change handler, and the text
 *   input to plug in
 * @returns Demo layout
 */
function DemoShell({
  result,
  delayTime,
  onDelayChange,
  children,
}: {
  result: string;
  delayTime: number;
  onDelayChange: (ms: number) => void;
  children: React.ReactNode;
}) {
  const resultId = useId();
  const delayTimeId = useId();

  return (
    <div className="flex flex-col gap-4">
      {children}
      <div className="grid grid-cols-[1fr_auto] items-center gap-2">
        <label htmlFor={resultId}>debounced result: </label>
        <Input id={resultId} readOnly value={result} />
        <label htmlFor={delayTimeId}>delay (ms)</label>
        <Input
          id={delayTimeId}
          onChange={(e) => {
            onDelayChange(e.target.valueAsNumber);
          }}
          placeholder="delay time"
          type="number"
          value={delayTime}
        />
      </div>
    </div>
  );
}

function UseDebouncedCallbackDemo() {
  const [delayTime, setDelayTime] = useState(250);
  const [result, setResult] = useState("");

  const onChange = useDebouncedCallback((value: string) => {
    setResult(value);
  }, delayTime);

  return (
    <DemoShell
      delayTime={delayTime}
      onDelayChange={setDelayTime}
      result={result}
    >
      <Input
        onChange={(e) => {
          onChange(e.target.value);
        }}
        placeholder="input text"
      />
    </DemoShell>
  );
}

const meta = {
  component: UseDebouncedCallbackDemo,
  tags: ["!manifest"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof UseDebouncedCallbackDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Plain debounce demo: result updates once delay has elapsed after input stops. */
export const Default: Story = {};

/**
 * IME-aware demo. Intermediate input during composition is not forwarded to
 * debounce; on commit (compositionEnd) it is flushed immediately.
 */
export const WithIme: Story = {
  render: () => {
    const [delayTime, setDelayTime] = useState(250);
    const [result, setResult] = useState("");

    const onChange = useDebouncedCallback((value: string) => {
      setResult(value);
    }, delayTime);

    return (
      <DemoShell
        delayTime={delayTime}
        onDelayChange={setDelayTime}
        result={result}
      >
        <Input
          onChange={(e) => {
            // Read the accurate composition state at fire time from nativeEvent (the render snapshot is one step behind)
            const { nativeEvent } = e;

            if (nativeEvent instanceof InputEvent && nativeEvent.isComposing) {
              return;
            }

            onChange(e.target.value);
          }}
          onCompositionEnd={(e) => {
            // Apply immediately on commit
            onChange(e.currentTarget.value);
            onChange.flush();
          }}
          placeholder="input text (IME 対応)"
        />
      </DemoShell>
    );
  },
};
