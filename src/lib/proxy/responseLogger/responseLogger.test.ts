import { NextResponse } from "next/server";
import { responseLogger } from "./responseLogger";

describe(responseLogger, () => {
  it("レスポンスのstatusとcontent-typeをログ出力すること", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const response = NextResponse.json({ ok: true });

    responseLogger(response);

    expect(consoleSpy).toHaveBeenCalledWith("[RESPONSE]", {
      status: 200,
      type: "application/json",
    });
    consoleSpy.mockRestore();
  });

  it("content-typeがない場合はnullを出力すること", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const response = NextResponse.next();

    responseLogger(response);

    expect(consoleSpy).toHaveBeenCalledWith("[RESPONSE]", {
      status: 200,
      type: null,
    });
    consoleSpy.mockRestore();
  });
});
