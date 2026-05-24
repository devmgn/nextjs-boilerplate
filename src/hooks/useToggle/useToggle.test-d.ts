// oxlint-disable react-hooks/rules-of-hooks
// 型推論のみを検証するため、フック呼び出しを実行時に評価しない関数内に閉じ込めている
import { useToggle } from "./useToggle";

function checkNoArg() {
  const [value, toggle] = useToggle();
  expectTypeOf(value).toEqualTypeOf<boolean>();
  expectTypeOf(toggle).parameter(0).toEqualTypeOf<boolean | undefined>();
}

function checkBooleanArg() {
  const [value] = useToggle(true);
  expectTypeOf(value).toEqualTypeOf<boolean>();
}

function checkArrayArg() {
  const [value, toggle] = useToggle(["light", "dark", "system"]);
  expectTypeOf(value).toEqualTypeOf<"light" | "dark" | "system">();
  expectTypeOf(toggle)
    .parameter(0)
    .toEqualTypeOf<"light" | "dark" | "system" | undefined>();
}

function checkArrayWithInitial() {
  const [value] = useToggle(["light", "dark", "system"], "dark");
  expectTypeOf(value).toEqualTypeOf<"light" | "dark" | "system">();
}

describe("useToggle 型推論", () => {
  it("引数なしのとき、値は boolean となる", () => {
    expectTypeOf(checkNoArg).toBeFunction();
  });

  it("boolean を渡したとき、値は boolean となる", () => {
    expectTypeOf(checkBooleanArg).toBeFunction();
  });

  it("配列リテラルを渡したとき、値はその要素のユニオン型に推論される", () => {
    expectTypeOf(checkArrayArg).toBeFunction();
  });

  it("配列と初期値を渡したとき、値の型は要素のユニオン型となる", () => {
    expectTypeOf(checkArrayWithInitial).toBeFunction();
  });
});
