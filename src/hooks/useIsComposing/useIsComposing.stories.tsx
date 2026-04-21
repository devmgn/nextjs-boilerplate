import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect, useId, useRef, useState } from "react";
import { useIsComposing } from "./useIsComposing";
import { Input } from "../../components/Input";

interface LogEntry {
  id: number;
  label: string;
  event: "compositionstart" | "compositionend";
  accent: "capture" | "target" | "bubble";
}

const accentClass: Record<LogEntry["accent"], string> = {
  capture: "text-primary",
  target: "text-foreground",
  bubble: "text-muted-foreground",
};

function StateCard({
  label,
  phase,
  value,
}: {
  label: string;
  phase: string;
  value: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-1 rounded-md border p-3 transition-colors ${
        value ? "border-primary bg-primary/10" : "border-border bg-background"
      }`}
    >
      <span className="text-label-sm text-muted-foreground">{phase}</span>
      <code className="text-label-md text-foreground">{label}</code>
      <span
        className={`font-mono text-body-md ${
          value ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {String(value)}
      </span>
    </div>
  );
}

const meta = {
  component: undefined,
  tags: ["!manifest"],
  parameters: { layout: "centered" },
  render: () => {
    const isComposingCapture = useIsComposing(true);
    const isComposingBubble = useIsComposing(false);
    const [log, setLog] = useState<LogEntry[]>([]);
    const counterRef = useRef(0);
    const inputId = useId();

    useEffect(() => {
      const append = (
        label: string,
        event: LogEntry["event"],
        accent: LogEntry["accent"],
      ) => {
        counterRef.current += 1;
        const id = counterRef.current;
        setLog((prev) => [...prev, { id, label, event, accent }]);
      };

      const phases = [
        { capture: true, accent: "capture", label: "📥 document (capture)" },
        { capture: false, accent: "bubble", label: "📤 document (bubble)" },
      ] as const;

      const handlers = phases.flatMap(({ capture, accent, label }) =>
        (["compositionstart", "compositionend"] as const).map((event) => ({
          event,
          capture,
          listener: () => {
            append(label, event, accent);
          },
        })),
      );

      for (const { event, listener, capture } of handlers) {
        document.addEventListener(event, listener, capture);
      }
      return () => {
        for (const { event, listener, capture } of handlers) {
          document.removeEventListener(event, listener, capture);
        }
      };
    }, []);

    const appendTarget = (event: LogEntry["event"]) => {
      counterRef.current += 1;
      const id = counterRef.current;
      setLog((prev) => [
        ...prev,
        { id, label: "🎯 input (target / React)", event, accent: "target" },
      ]);
    };

    return (
      <div className="flex w-[520px] flex-col gap-5">
        <div className="flex flex-col gap-1">
          <p className="text-label-lg font-semibold text-foreground">
            capture と bubble の発火順デモ
          </p>
          <p className="text-body-sm text-muted-foreground">
            下の入力欄に日本語 IME で「かんじ」などと入力して変換すると、 同じ{" "}
            <code>compositionstart</code> が capture → target → bubble の順で
            記録されます。<code>useIsComposing(true)</code>{" "}
            はこのうち最も早いタイミング、
            <code>useIsComposing(false)</code>{" "}
            は最も遅いタイミングで状態を切り替えます。
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StateCard
            label="useIsComposing(true)"
            phase="capture phase"
            value={isComposingCapture}
          />
          <StateCard
            label="useIsComposing(false)"
            phase="bubble phase"
            value={isComposingBubble}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={inputId} className="text-label-md text-foreground">
            your text
          </label>
          <Input
            id={inputId}
            onCompositionStart={() => {
              appendTarget("compositionstart");
            }}
            onCompositionEnd={() => {
              appendTarget("compositionend");
            }}
          />
        </div>

        <div className="flex flex-col gap-2 rounded-md border border-border bg-muted/40 p-3">
          <div className="flex items-center justify-between">
            <span className="text-label-md text-foreground">Event log</span>
            <button
              type="button"
              className="text-label-sm text-muted-foreground underline"
              onClick={() => {
                counterRef.current = 0;
                setLog([]);
              }}
            >
              clear
            </button>
          </div>
          {log.length === 0 ? (
            <p className="text-body-sm text-muted-foreground">
              まだイベントが記録されていません。
            </p>
          ) : (
            <ol className="flex flex-col gap-1 font-mono text-body-sm">
              {log.map((entry) => (
                <li
                  key={entry.id}
                  className={`flex items-center gap-2 ${accentClass[entry.accent]}`}
                >
                  <span className="w-6 text-right text-muted-foreground tabular-nums">
                    {entry.id}
                  </span>
                  <span className="min-w-[170px]">{entry.label}</span>
                  <span>{entry.event}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    );
  },
} satisfies Meta<typeof useIsComposing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
