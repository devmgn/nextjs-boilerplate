import type { KyRequest, KyResponse, NormalizedOptions } from "ky";
import { responseToCamelCase } from ".";

describe("responseToCamelCase", () => {
  let mockRequest: KyRequest;
  let mockOptions: NormalizedOptions;

  beforeEach(() => {
    mockRequest = {} as KyRequest;
    mockOptions = {} as NormalizedOptions;
  });

  it("JSON以外のコンテンツタイプに対してundefinedを返す", async () => {
    const mockResponse = {
      headers: new Headers({ "content-type": "text/plain" }),
    } as KyResponse;

    const result = await responseToCamelCase(
      mockRequest,
      mockOptions,
      mockResponse,
    );
    expect(result).toBeUndefined();
  });

  it("スネークケースのキーがキャメルケースに変換されること", async () => {
    // biome-ignore lint/style/useNamingConvention: <explanation>
    const mockBody = { user_name: "John Doe", user_age: 30 };
    const mockResponse = {
      headers: new Headers({ "content-type": "application/json" }),
      json: vi.fn().mockResolvedValue(mockBody),
    } as unknown as KyResponse;

    const result = await responseToCamelCase(
      mockRequest,
      mockOptions,
      mockResponse,
    );
    expect(result).toBeInstanceOf(Response);
    const resultBody = await (result as Response).json();
    expect(resultBody).toEqual({ userName: "John Doe", userAge: 30 });
  });

  it("ネストされたオブジェクトでも正しくキャメルケースに変換されること", async () => {
    const mockBody = {
      // biome-ignore lint/style/useNamingConvention: <explanation>
      user_info: {
        // biome-ignore lint/style/useNamingConvention: <explanation>
        first_name: "John",
        // biome-ignore lint/style/useNamingConvention: <explanation>
        last_name: "Doe",
        // biome-ignore lint/style/useNamingConvention: <explanation>
        address: { street_name: "Main St", house_number: 123 },
      },
    };
    const mockResponse = {
      headers: new Headers({ "content-type": "application/json" }),
      json: vi.fn().mockResolvedValue(mockBody),
    } as unknown as KyResponse;

    const result = await responseToCamelCase(
      mockRequest,
      mockOptions,
      mockResponse,
    );
    expect(result).toBeInstanceOf(Response);

    const resultBody = await (result as Response).json();
    expect(resultBody).toEqual({
      userInfo: {
        firstName: "John",
        lastName: "Doe",
        address: { streetName: "Main St", houseNumber: 123 },
      },
    });
  });

  it("JSONのパースに失敗した場合、undefinedを返しエラーをログに出力すること", async () => {
    const mockResponse = {
      headers: new Headers({ "content-type": "application/json" }),
      json: vi.fn().mockRejectedValue(new Error("Invalid JSON")),
    } as unknown as KyResponse;

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await responseToCamelCase(
      mockRequest,
      mockOptions,
      mockResponse,
    );
    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Response body is not a valid JSON:",
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });
});
