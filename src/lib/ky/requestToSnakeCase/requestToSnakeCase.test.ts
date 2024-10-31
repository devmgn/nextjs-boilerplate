import type { KyRequest, NormalizedOptions } from "ky";
import type { MockInstance } from "vitest";
import { requestToSnakeCase } from ".";

describe("requestToSnakeCase", () => {
  let consoleSpy: MockInstance;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("キャメルケースのキーをスネークケースに変換されること", () => {
    const mockRequest = {
      headers: new Headers({ "content-type": "application/json" }),
    } as KyRequest;
    const mockOptions = {
      body: JSON.stringify({ userName: "John Doe", userAge: 30 }),
    } as NormalizedOptions;

    const result = requestToSnakeCase(mockRequest, mockOptions);

    result?.json().then((body) => {
      // biome-ignore lint/style/useNamingConvention: <explanation>
      expect(body).toEqual({ user_name: "John Doe", user_age: 30 });
    });
  });

  it("ネストされたオブジェクトも正しく変換されること", () => {
    const mockRequest = {
      headers: new Headers({ "content-type": "application/json" }),
    } as KyRequest;
    const mockOptions = {
      body: JSON.stringify({
        userInfo: {
          firstName: "John",
          lastName: "Doe",
          address: { streetName: "Main St", houseNumber: 123 },
        },
      }),
    } as NormalizedOptions;

    const result = requestToSnakeCase(mockRequest, mockOptions);

    result?.json().then((body) => {
      expect(body).toEqual({
        // biome-ignore lint/style/useNamingConvention: <explanation>
        user_info: {
          // biome-ignore lint/style/useNamingConvention: <explanation>
          first_name: "John",
          // biome-ignore lint/style/useNamingConvention: <explanation>
          last_name: "Doe",
          // biome-ignore lint/style/useNamingConvention: <explanation>
          address: { street_name: "Main St", house_number: 123 },
        },
      });
    });
  });

  it("JSONでないContent-Typeのとき、undefinedを返すこと", () => {
    const mockRequest = {
      headers: new Headers({ "content-type": "text/plain" }),
    } as KyRequest;
    const mockOptions = { body: "test" } as NormalizedOptions;

    const result = requestToSnakeCase(mockRequest, mockOptions);
    expect(result).toBeUndefined();
  });

  it("options.bodyが文字列でないとき、undefinedを返すこと", () => {
    const mockRequest = {
      headers: new Headers({ "content-type": "application/json" }),
    } as KyRequest;
    const mockOptions = { body: {} } as NormalizedOptions;

    const result = requestToSnakeCase(mockRequest, mockOptions);
    expect(result).toBeUndefined();
  });

  it("JSONのパースに失敗した場合、undefinedを返しエラーをログに出力する", () => {
    const mockRequest = {
      headers: new Headers({ "content-type": "application/json" }),
    } as KyRequest;
    const mockOptions = {
      body: "Invalid JSON",
    } as NormalizedOptions;

    const result = requestToSnakeCase(mockRequest, mockOptions);
    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to parse request body:",
      expect.any(Error),
    );
  });
});
