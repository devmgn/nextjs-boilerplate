import { describe, expect, it, vi } from "vitest";
import { reportWebVital } from "./report-web-vital";

type IncomingMetric = Parameters<typeof reportWebVital>[0];

const validMetric = {
  name: "LCP",
  value: 2500,
  rating: "good",
  id: "v3-123",
  delta: 2500,
  entries: [],
  navigationType: "navigate",
} satisfies IncomingMetric;

describe(reportWebVital, () => {
  it("有効なmetricを受け取ったとき、console.infoが呼ばれること", () => {
    const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    reportWebVital(validMetric);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[Web Vitals]: LCP: 2500 / Rating: good"),
      expect.any(String),
      expect.objectContaining({ name: "LCP", value: 2500 })
    );

    consoleSpy.mockRestore();
  });

  it("不正なmetricを受け取ったとき、console.infoが呼ばれないこと", () => {
    const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    reportWebVital({});

    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
