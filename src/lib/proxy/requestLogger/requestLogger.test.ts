import { NextRequest } from "next/server";
import { requestLogger } from "./requestLogger";

describe(requestLogger, () => {
  it("リクエストのURLとメソッドをログ出力すること", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const request = new NextRequest("https://example.com/test", {
      method: "GET",
    });

    requestLogger(request);

    expect(consoleSpy).toHaveBeenCalledWith("[REQUEST]", {
      url: "https://example.com/test",
      method: "GET",
    });
    consoleSpy.mockRestore();
  });

  it("POSTリクエストのメソッドを正しく出力すること", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const request = new NextRequest("https://example.com/api/data", {
      method: "POST",
    });

    requestLogger(request);

    expect(consoleSpy).toHaveBeenCalledWith("[REQUEST]", {
      url: "https://example.com/api/data",
      method: "POST",
    });
    consoleSpy.mockRestore();
  });
});
