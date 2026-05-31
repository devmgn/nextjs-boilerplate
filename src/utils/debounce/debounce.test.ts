import { debounce } from "./debounce";

describe(debounce, () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  describe("基本動作 (trailing)", () => {
    it("待機時間後に1回だけ実行されること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      debounced();
      debounced();
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("最後の呼び出しの引数で実行されること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced("a");
      debounced("b");
      debounced("c");

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledExactlyOnceWith("c");
    });

    it("待機中に再呼び出しするとタイマーがリセットされること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      // 100ms 待機を 80ms + 80ms でまたぐがタイマーリセットで未発火、残り 20ms で発火
      debounced();
      vi.advanceTimersByTime(80);
      expect(fn).not.toHaveBeenCalled();

      debounced();
      vi.advanceTimersByTime(80);
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(20);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("複数の引数が正しく渡されること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced(1, "two", { three: 3 });
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledExactlyOnceWith(1, "two", { three: 3 });
    });

    it("連続するバーストが独立して処理されること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced("first");
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledExactlyOnceWith("first");

      debounced("second");
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(2, "second");
    });
  });

  describe("wait: 0", () => {
    it("タイマー発火時に実行されること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 0);

      debounced("zero");
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(0);
      expect(fn).toHaveBeenCalledExactlyOnceWith("zero");
    });
  });

  describe("cancel", () => {
    it("保留中の実行がキャンセルされること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      debounced.cancel();
      vi.advanceTimersByTime(100);

      expect(fn).not.toHaveBeenCalled();
    });

    it("cancel 後に再び呼び出せること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced("a");
      debounced.cancel();

      debounced("b");
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledExactlyOnceWith("b");
    });

    it("保留中でない場合に cancel しても安全であること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      expect(() => {
        debounced.cancel();
      }).not.toThrow();
    });
  });

  describe("flush", () => {
    it("保留中の関数が即座に実行されること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced("flushed");
      debounced.flush();

      expect(fn).toHaveBeenCalledExactlyOnceWith("flushed");
    });

    it("flush 後にタイマーで重複実行されないこと", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      debounced.flush();
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("flush 後に新しいサイクルを開始できること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced("first");
      debounced.flush();
      expect(fn).toHaveBeenCalledTimes(1);

      debounced("second");
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(2, "second");
    });

    it.for<{
      state: string;
      setup: (
        d: ReturnType<typeof debounce<[string]>>,
        fn: ReturnType<typeof vi.fn>,
      ) => number;
    }>([
      { state: "初期状態 (保留無し)", setup: () => 0 },
      {
        state: "flush 済み",
        setup: (d) => {
          d("data");
          d.flush();
          return 1;
        },
      },
      {
        state: "flush を2回連続で呼んだ状態",
        setup: (d) => {
          d("data");
          d.flush();
          d.flush();
          return 1;
        },
      },
      {
        state: "cancel 済み",
        setup: (d) => {
          d("data");
          d.cancel();
          return 0;
        },
      },
      {
        state: "サイクル自然完了後",
        setup: (d) => {
          d("data");
          vi.advanceTimersByTime(100);
          return 1;
        },
      },
    ])("$state からの flush で追加の invoke が起きないこと", ({ setup }) => {
      const fn = vi.fn<(x: string) => void>();
      const debounced = debounce(fn, 100);
      const expectedBefore = setup(debounced, fn);
      expect(fn).toHaveBeenCalledTimes(expectedBefore);

      expect(() => {
        debounced.flush();
      }).not.toThrow();
      expect(fn).toHaveBeenCalledTimes(expectedBefore);
    });
  });

  describe("再帰呼び出し", () => {
    it("コールバック内から再帰呼び出しした引数が次サイクルで実行されること", () => {
      const calls: string[] = [];
      const callback = vi.fn<(x: string) => void>((x) => {
        calls.push(x);
      });
      const debounced = debounce(callback, 100);

      // 1 回目の invoke だけ再帰呼び出しする
      callback.mockImplementationOnce((x) => {
        calls.push(x);
        debounced("re-entry");
      });

      debounced("a");
      vi.advanceTimersByTime(100);
      expect(calls).toStrictEqual(["a"]);

      // 再帰で予約された "re-entry" が次サイクルで発火する
      vi.advanceTimersByTime(100);
      expect(calls).toStrictEqual(["a", "re-entry"]);
    });
  });

  describe("例外復旧", () => {
    it("コールバックが例外を投げても次のサイクルが動作すること", () => {
      const fn = vi.fn().mockImplementationOnce(() => {
        throw new Error("boom");
      });
      const debounced = debounce(fn, 100);

      debounced("a");
      expect(() => {
        vi.advanceTimersByTime(100);
      }).toThrow("boom");

      debounced("b");
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(2, "b");
    });
  });

  describe("エッジケース", () => {
    it("多数回呼び出した後に flush すると最新の引数で実行されること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced("a");
      debounced("b");
      debounced("c");
      debounced.flush();

      expect(fn).toHaveBeenCalledExactlyOnceWith("c");
    });

    it("wait:0 で連続呼び出ししても trailing で最後の引数1回だけ実行されること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 0);

      debounced("a");
      debounced("b");
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(0);
      expect(fn).toHaveBeenCalledExactlyOnceWith("b");
    });

    it("コールバック内から flush を呼んでも二重実行・例外が起きないこと", () => {
      const calls: string[] = [];
      const fn = vi.fn<(x: string) => void>((x) => {
        calls.push(x);
      });
      const debounced = debounce(fn, 100);

      fn.mockImplementationOnce((x) => {
        calls.push(x);
        // run() で lastArgs はクリア済みなので flush は no-op になる
        debounced.flush();
      });

      debounced("a");
      expect(() => {
        vi.advanceTimersByTime(100);
      }).not.toThrow();
      expect(calls).toStrictEqual(["a"]);

      // 後続のタイマーも残っていない
      vi.advanceTimersByTime(100);
      expect(calls).toStrictEqual(["a"]);
    });

    it("コールバック内から cancel を呼んでも安全で、後続サイクルが動くこと", () => {
      const fn = vi.fn<(x: string) => void>();
      const debounced = debounce(fn, 100);

      fn.mockImplementationOnce(() => {
        // 1 回目の実行中に自分自身を cancel しても安全であることを確認する
        expect(fn).toHaveBeenCalledTimes(1);
        debounced.cancel();
      });

      debounced("a");
      expect(() => {
        vi.advanceTimersByTime(100);
      }).not.toThrow();
      expect(fn).toHaveBeenCalledExactlyOnceWith("a");

      debounced("b");
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(2, "b");
    });

    it("flush 中にコールバックが例外を投げても次のサイクルが動作すること", () => {
      const fn = vi.fn().mockImplementationOnce(() => {
        throw new Error("boom");
      });
      const debounced = debounce(fn, 100);

      debounced("a");
      expect(() => {
        debounced.flush();
      }).toThrow("boom");

      // 例外後も状態が壊れず次サイクルが動く
      debounced("b");
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(2, "b");
    });

    it("cancel 後に flush しても何も実行されないこと", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced("a");
      debounced.cancel();
      debounced.flush();
      vi.advanceTimersByTime(100);

      expect(fn).not.toHaveBeenCalled();
    });

    it("返り値が呼び出し可能で cancel/flush メソッドを持つこと", () => {
      const debounced = debounce(() => {}, 100);

      expect(debounced).toBeTypeOf("function");
      expect(debounced.cancel).toBeTypeOf("function");
      expect(debounced.flush).toBeTypeOf("function");
    });
  });

  describe("バリデーション", () => {
    it.for<{ label: string; create: () => unknown }>([
      { label: "wait が負数", create: () => debounce(() => {}, -1) },
      { label: "wait が NaN", create: () => debounce(() => {}, Number.NaN) },
      {
        label: "wait が Infinity",
        create: () => debounce(() => {}, Number.POSITIVE_INFINITY),
      },
    ])("$label だと TypeError を投げること", ({ create }) => {
      expect(create).toThrow(TypeError);
    });
  });
});
