import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { requestLogger } from "./request-logger";

describe(requestLogger, () => {
  it("logs the request URL and method", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const request = new NextRequest("https://example.com/test", {
      method: "GET",
    });

    requestLogger(request);

    expect(consoleSpy).toHaveBeenCalledWith("[REQUEST]", {
      url: "https://example.com/test",
      method: "GET",
    });
  });

  it("logs the method of a POST request correctly", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const request = new NextRequest("https://example.com/api/data", {
      method: "POST",
    });

    requestLogger(request);

    expect(consoleSpy).toHaveBeenCalledWith("[REQUEST]", {
      url: "https://example.com/api/data",
      method: "POST",
    });
  });
});
