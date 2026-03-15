import { render } from "@testing-library/react";
import { WebVitalsReporter } from "./WebVitalsReporter";

const { mockUseReportWebVitals } = vi.hoisted(() => ({
  mockUseReportWebVitals: vi.fn(),
}));

vi.mock(import("next/web-vitals"), () => ({
  useReportWebVitals: mockUseReportWebVitals,
}));

function renderAndGetReporter() {
  render(<WebVitalsReporter />);
  const [[reportMetric]] = mockUseReportWebVitals.mock.calls;
  return reportMetric as (metric: Record<string, unknown>) => void;
}

describe(WebVitalsReporter, () => {
  it("nullをレンダリングすること", () => {
    const { container } = render(<WebVitalsReporter />);
    expect(container.innerHTML).toBe("");
  });

  it("useReportWebVitalsにコールバックを渡すこと", () => {
    render(<WebVitalsReporter />);
    expect(mockUseReportWebVitals).toHaveBeenCalledWith(expect.any(Function));
  });

  it("有効なmetricを受け取ったとき、console.infoが呼ばれること", () => {
    const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const reportMetric = renderAndGetReporter();

    reportMetric({
      name: "LCP",
      value: 2500,
      rating: "good",
      id: "v3-123",
      delta: 2500,
      entries: [],
      navigationType: "navigate",
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[Web Vitals]: LCP: 2500 / Rating: good"),
      expect.any(String),
      expect.objectContaining({ name: "LCP", value: 2500 }),
    );

    consoleSpy.mockRestore();
  });

  it("不正なmetricを受け取ったとき、console.infoが呼ばれないこと", () => {
    const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const reportMetric = renderAndGetReporter();

    reportMetric({ invalid: true });

    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
