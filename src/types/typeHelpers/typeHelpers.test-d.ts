import type { Expand, FlatObject, Primitive } from "./typeHelpers";

describe("typeHelpers", () => {
  describe("Expand", () => {
    it("Expand: プリミティブ型はそのまま返す", () => {
      expectTypeOf<Expand<string>>().toEqualTypeOf<string>();
      expectTypeOf<Expand<number>>().toEqualTypeOf<number>();
      expectTypeOf<Expand<boolean>>().toEqualTypeOf<boolean>();
      expectTypeOf<Expand<null>>().toEqualTypeOf<null>();
      expectTypeOf<Expand<undefined>>().toEqualTypeOf<undefined>();
    });

    it("Expand: フラットな交差型を展開する", () => {
      type Input = { a: string } & { b: number };
      interface Expected {
        a: string;
        b: number;
      }
      expectTypeOf<Expand<Input>>().toEqualTypeOf<Expected>();
    });

    it("Expand: ネストされた交差型を再帰的に展開する", () => {
      interface Input {
        nested: { a: string } & { b: number };
      }
      interface Expected {
        nested: { a: string; b: number };
      }
      expectTypeOf<Expand<Input>>().toEqualTypeOf<Expected>();
    });
  });

  describe("Primitive", () => {
    it("Primitive: すべてのプリミティブ値を受け入れる", () => {
      expectTypeOf<null>().toExtend<Primitive>();
      expectTypeOf<undefined>().toExtend<Primitive>();
      expectTypeOf<string>().toExtend<Primitive>();
      expectTypeOf<number>().toExtend<Primitive>();
      expectTypeOf<boolean>().toExtend<Primitive>();
      expectTypeOf<symbol>().toExtend<Primitive>();
      expectTypeOf<bigint>().toExtend<Primitive>();
    });

    it("Primitive: オブジェクト型は含まない", () => {
      expectTypeOf<{ a: string }>().not.toExtend<Primitive>();
      expectTypeOf<string[]>().not.toExtend<Primitive>();
    });
  });

  describe("FlatObject", () => {
    // FlatObject
    it("FlatObject: プリミティブ値のみのオブジェクトを受け入れる", () => {
      expectTypeOf<{
        a: string;
        b: number;
        c: null;
      }>().toExtend<FlatObject>();
    });

    it("FlatObject: ネストされたオブジェクトは受け入れない", () => {
      expectTypeOf<{ a: { nested: string } }>().not.toExtend<FlatObject>();
    });
  });
});
