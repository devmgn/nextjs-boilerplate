import { NextResponse } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { responseLogger } from "./response-logger";

describe(responseLogger, () => {
  it("logs the response status and content-type", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const response = NextResponse.json({ ok: true });

    responseLogger(response);

    expect(consoleSpy).toHaveBeenCalledWith("[RESPONSE]", {
      status: 200,
      type: "application/json",
    });
  });

  it("logs null when content-type is missing", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const response = NextResponse.next();

    responseLogger(response);

    expect(consoleSpy).toHaveBeenCalledWith("[RESPONSE]", {
      status: 200,
      type: null,
    });
  });
});
