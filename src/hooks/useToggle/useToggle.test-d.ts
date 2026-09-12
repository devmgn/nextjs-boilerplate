import { useToggle } from "./useToggle";

// オーバーロードの解決結果は「実際に呼び出す式」からしか得られないため、型検証用の
// ラッパーからも useToggle を呼ぶ。フックを呼ぶ関数はカスタムフックそのものなので
// `use` プレフィックスを付けて Rules of Hooks を満たす。
// いずれも実行時には評価せず、tsc による型検査だけを目的とする。

function useNoArg() {
  const [value, toggle] = useToggle();
  expectTypeOf(value).toEqualTypeOf<boolean>();
  expectTypeOf(toggle).parameter(0).toEqualTypeOf<boolean | undefined>();
}

function useBooleanArg() {
  const [value] = useToggle(true);
  expectTypeOf(value).toEqualTypeOf<boolean>();
}

function useArrayArg() {
  const [value, toggle] = useToggle(["light", "dark", "system"]);
  expectTypeOf(value).toEqualTypeOf<"light" | "dark" | "system">();
  expectTypeOf(toggle)
    .parameter(0)
    .toEqualTypeOf<"light" | "dark" | "system" | undefined>();
}

function useArrayWithInitial() {
  const [value] = useToggle(["light", "dark", "system"], "dark");
  expectTypeOf(value).toEqualTypeOf<"light" | "dark" | "system">();
}

describe("useToggle 型推論", () => {
  it("引数なしのとき、値は boolean となる", () => {
    expectTypeOf(useNoArg).toBeFunction();
  });

  it("boolean を渡したとき、値は boolean となる", () => {
    expectTypeOf(useBooleanArg).toBeFunction();
  });

  it("配列リテラルを渡したとき、値はその要素のユニオン型に推論される", () => {
    expectTypeOf(useArrayArg).toBeFunction();
  });

  it("配列と初期値を渡したとき、値の型は要素のユニオン型となる", () => {
    expectTypeOf(useArrayWithInitial).toBeFunction();
  });
});
