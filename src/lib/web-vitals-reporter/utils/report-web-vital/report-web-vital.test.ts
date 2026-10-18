import { describe, expect, it, vi } from "vitest";
import { reportWebVital } from "./report-web-vital";

type IncomingMetric = Parameters<typeof reportWebVital>[0];

const validMetric = {
  name: "LCP",
  value: 2500,
  rating: "good",
} satisfies IncomingMetric;

describe(reportWebVital, () => {
  it("calls console.info for a valid metric", () => {
    const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    reportWebVital(validMetric);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[Web Vitals]: LCP: 2500 / Rating: good"),
      expect.any(String),
      expect.objectContaining({ name: "LCP", value: 2500 })
    );
  });

  it("does not call console.info for an invalid metric", () => {
    const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    reportWebVital({});

    expect(consoleSpy).not.toHaveBeenCalled();
  });
});
