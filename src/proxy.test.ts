import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { config, proxy } from "./proxy";

describe(proxy, () => {
  it("returns a NextResponse", () => {
    const request = new NextRequest("https://example.com/");
    const response = proxy(request);
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
  });

  it("sets the x-request-id header", () => {
    const request = new NextRequest("https://example.com/");
    const response = proxy(request);
    // prettier-ignore
    const uuidPattern = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/u;
    expect(response.headers.get("x-request-id")).toMatch(uuidPattern);
  });

  it("logs the request and response", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const request = new NextRequest("https://example.com/page");

    proxy(request);

    expect(consoleSpy).toHaveBeenCalledWith(
      "[REQUEST]",
      expect.objectContaining({
        url: "https://example.com/page",
        method: "GET",
      })
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "[RESPONSE]",
      expect.objectContaining({ status: 200 })
    );
  });
});

describe("config", () => {
  it("defines a matcher", () => {
    expect(config.matcher).toHaveLength(1);
    expect(config.matcher[0]).toContain("(?!api|_next/static|_next/image");
  });
});
