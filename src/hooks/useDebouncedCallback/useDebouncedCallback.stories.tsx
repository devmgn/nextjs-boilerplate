import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useId, useState } from "react";
import { useDebouncedCallback } from "./useDebouncedCallback";
import { Input } from "../../components/form/Input";

/** Result 表示と delay 入力の共通シェル。各 story はここにテキスト入力を差し込む。 */
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

const meta = {
  component: undefined,
  tags: ["!manifest"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof useDebouncedCallback>;

export default meta;
type Story = StoryObj<typeof useDebouncedCallback>;

/** 入力が止まってから delay 経過後に result が更新される、純粋な debounce デモ。 */
export const Default: Story = {
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
            onChange(e.target.value);
          }}
          placeholder="input text"
        />
      </DemoShell>
    );
  },
};

/** IME 対応デモ。変換中の中間入力は debounce に流さず、変換確定時 (compositionEnd) に flush で即時反映する。 */
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
            // 発火時点の正確な変換状態を nativeEvent から読む（render スナップショットは1テンポ古い）
            const { nativeEvent } = e;
            if (nativeEvent instanceof InputEvent && nativeEvent.isComposing) {
              return;
            }
            onChange(e.target.value);
          }}
          onCompositionEnd={(e) => {
            // 変換確定時は即時反映
            onChange(e.currentTarget.value);
            onChange.flush();
          }}
          placeholder="input text (IME 対応)"
        />
      </DemoShell>
    );
  },
};
