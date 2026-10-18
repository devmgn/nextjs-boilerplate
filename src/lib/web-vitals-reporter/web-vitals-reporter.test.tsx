import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WebVitalsReporter } from "./web-vitals-reporter";

describe(WebVitalsReporter, () => {
  it("renders null", () => {
    const { container } = render(<WebVitalsReporter />);
    expect(container).toBeEmptyDOMElement();
  });
});
