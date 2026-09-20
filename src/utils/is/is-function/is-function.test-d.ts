import { describe, expectTypeOf, it } from "vitest";
import { isFunction } from "./is-function";

// 初期化子から型を絞り込ませないため、宣言された戻り値型で union を作る。
function makeUnion(): string | (() => string) {
  return "x";
}

describe(isFunction, () => {
  it("ユニオンを関数成分と非関数成分に narrow すること", () => {
    const union = makeUnion();

    if (isFunction(union)) {
      expectTypeOf(union).toEqualTypeOf<() => string>();
    } else {
      expectTypeOf(union).toEqualTypeOf<string>();
    }
  });
});
