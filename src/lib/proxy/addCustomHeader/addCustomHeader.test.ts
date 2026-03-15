import { NextResponse } from "next/server";
import { addCustomHeader } from "./addCustomHeader";

describe(addCustomHeader, () => {
  it("レスポンスにx-request-idヘッダーを設定すること", () => {
    const response = NextResponse.next();
    addCustomHeader(response);
    const requestId = response.headers.get("x-request-id");
    // prettier-ignore
    const uuidPattern = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/;
    expect(requestId).toMatch(uuidPattern);
  });

  it("呼び出しごとに異なるUUIDを生成すること", () => {
    const response1 = NextResponse.next();
    const response2 = NextResponse.next();
    addCustomHeader(response1);
    addCustomHeader(response2);
    expect(response1.headers.get("x-request-id")).not.toBe(
      response2.headers.get("x-request-id"),
    );
  });
});
