import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useId, useState } from "react";
import { useMediaQuery } from "./useMediaQuery";
import { Input } from "../../components/Input";

const QUERIES = [
  "(min-width: 768px)",
  "(min-width: 1024px)",
  "(prefers-color-scheme: dark)",
  "(prefers-reduced-motion: reduce)",
] as const;

const meta = {
  parameters: {
    layout: "centered",
  },
  render: () => {
    const [query, setQuery] = useState<string>(QUERIES[0]);
    const [lastEvent, setLastEvent] = useState<string>("none");
    const queryId = useId();
    const resultId = useId();
    const eventId = useId();

    const matches = useMediaQuery(query, (event) => {
      setLastEvent(event.matches ? "matched" : "unmatched");
    });

    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[auto_1fr] items-center gap-2">
          <label htmlFor={queryId}>Query: </label>
          <select
            className="rounded border p-1"
            id={queryId}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            value={query}
          >
            {QUERIES.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
          <label htmlFor={resultId}>Matches: </label>
          <Input id={resultId} readOnly value={matches.toString()} />
          <label htmlFor={eventId}>Last onChange: </label>
          <Input id={eventId} readOnly value={lastEvent} />
        </div>
        <p className="text-sm text-gray-500">
          Resize the browser window to see the media query result change.
        </p>
      </div>
    );
  },
} satisfies Meta<typeof useMediaQuery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
