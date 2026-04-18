import { debounce } from "./debounce";

describe(debounce, () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  describe("trailing (default)", () => {
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

    it("edges 未指定と edges: ['trailing'] が同一の動作をすること", () => {
      const fn1 = vi.fn();
      const fn2 = vi.fn();
      const d1 = debounce(fn1, 100);
      const d2 = debounce(fn2, 100, { edges: ["trailing"] });

      d1("a");
      d2("a");
      expect(fn1).not.toHaveBeenCalled();
      expect(fn2).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(fn1).toHaveBeenCalledExactlyOnceWith("a");
      expect(fn2).toHaveBeenCalledExactlyOnceWith("a");
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

  describe("leading", () => {
    it("最初の呼び出しで即座に実行されること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, { edges: ["leading"] });

      debounced("first");
      expect(fn).toHaveBeenCalledExactlyOnceWith("first");
    });

    it("待機中の連続呼び出しは無視されること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, { edges: ["leading"] });

      debounced();
      debounced();
      debounced();
      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("待機中に再呼び出しするとクールダウンが延長されること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, { edges: ["leading"] });

      debounced("a");
      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(80);
      debounced("b");

      // 最初の呼び出しから100ms経過してもクールダウンが延長されている
      vi.advanceTimersByTime(80);
      debounced("c");
      expect(fn).toHaveBeenCalledTimes(1);

      // 最後の再呼び出しから100ms後にクールダウン完了
      vi.advanceTimersByTime(100);
      debounced("d");
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(2, "d");
    });

    it("待機時間後に再び leading 実行できること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, { edges: ["leading"] });

      debounced("a");
      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);

      debounced("b");
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(2, "b");
    });

    it("保留中のタイマーがあれば flush で即時実行されること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, { edges: ["leading"] });

      debounced("a");
      debounced("b");
      expect(fn).toHaveBeenCalledTimes(1);

      // flush は edges に関係なく「保留中のタイマーがあれば lastArgs で即実行」
      debounced.flush();
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(2, "b");
    });

    it("flush 後に再び leading が発火すること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, { edges: ["leading"] });

      debounced("a");
      debounced("b");
      debounced.flush();
      expect(fn).toHaveBeenCalledTimes(2);

      debounced("c");
      expect(fn).toHaveBeenCalledTimes(3);
      expect(fn).toHaveBeenNthCalledWith(3, "c");
    });

    it("leading コールバック内から再帰呼び出ししても leading が二重発火しないこと", () => {
      const calls: string[] = [];
      const debounced = debounce(
        (x: string) => {
          calls.push(x);
          if (x === "a") {
            debounced("re-entry");
          }
        },
        100,
        { edges: ["leading"] },
      );

      debounced("a");
      // 再帰呼び出しは isLeadingInvoked ガードにより leading 発火せず
      expect(calls).toStrictEqual(["a"]);

      // leading-only のため trailing も発火しない
      vi.advanceTimersByTime(100);
      expect(calls).toStrictEqual(["a"]);
    });

    it("クールダウン完了後に schedule→flush しても stale な引数で実行されないこと", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, { edges: ["leading"] });

      debounced("stale");
      debounced("stale2");

      // クールダウン完了 → タイマーコールバックで lastArgs がクリアされる
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);

      // lastArgs が残っていると schedule → flush で stale な引数で実行されてしまう
      debounced.schedule();
      debounced.flush();
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe("leading + trailing", () => {
    it("先頭と末尾の両方で実行されること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, {
        edges: ["leading", "trailing"],
      });

      debounced("a");
      expect(fn).toHaveBeenCalledExactlyOnceWith("a");

      debounced("b");
      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(2, "b");
    });

    it("1回だけの呼び出しでは leading のみ実行されること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, {
        edges: ["leading", "trailing"],
      });

      debounced("only");
      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe("leading + trailing (edge cases)", () => {
    it("3回以上のバーストで trailing が最後の引数を使うこと", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, {
        edges: ["leading", "trailing"],
      });

      debounced("a");
      debounced("b");
      debounced("c");
      expect(fn).toHaveBeenCalledExactlyOnceWith("a");

      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(2, "c");
    });

    it("flush で待機中の trailing を即時実行できること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, {
        edges: ["leading", "trailing"],
      });

      debounced("a");
      debounced("b");
      expect(fn).toHaveBeenCalledTimes(1);

      debounced.flush();
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(2, "b");
    });

    it("cancel すると trailing が発火しないこと", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, {
        edges: ["leading", "trailing"],
      });

      debounced("a");
      debounced("b");
      expect(fn).toHaveBeenCalledTimes(1);

      debounced.cancel();
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("cancel 後に新しいサイクルで leading が発火すること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, {
        edges: ["leading", "trailing"],
      });

      debounced("a");
      debounced("b");
      debounced.cancel();

      debounced("c");
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(2, "c");
    });

    it("flush 後に新しいサイクルで leading が発火すること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, {
        edges: ["leading", "trailing"],
      });

      debounced("a");
      debounced("b");
      debounced.flush();
      expect(fn).toHaveBeenCalledTimes(2);

      debounced("c");
      expect(fn).toHaveBeenCalledTimes(3);
      expect(fn).toHaveBeenNthCalledWith(3, "c");
    });

    it("クールダウン後に再バーストすると leading が再発火すること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, {
        edges: ["leading", "trailing"],
      });

      // --- cycle 1: leading + trailing が両方発火
      debounced("a1");
      debounced("a2");
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2);

      // --- cycle 2: クールダウン解除後、再び leading が発火
      debounced("b1");
      expect(fn).toHaveBeenCalledTimes(3);
      expect(fn).toHaveBeenNthCalledWith(3, "b1");

      debounced("b2");
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(4);
      expect(fn).toHaveBeenNthCalledWith(4, "b2");
    });
  });

  describe("edges 共通の flush 挙動", () => {
    it.for<{ name: string; edges: Array<"leading" | "trailing"> }>([
      { name: "leading", edges: ["leading"] },
      { name: "leading+trailing", edges: ["leading", "trailing"] },
    ])(
      "$name で1回だけの呼び出し後に flush しても追加実行されないこと",
      ({ edges }) => {
        const fn = vi.fn();
        const debounced = debounce(fn, 100, { edges });

        debounced("only");
        expect(fn).toHaveBeenCalledExactlyOnceWith("only");

        // タイマーは存在するが lastArgs は leading の invoke で消費済み
        debounced.flush();
        expect(fn).toHaveBeenCalledTimes(1);
      },
    );
  });

  describe("edges: []", () => {
    it("空配列の場合は実行されないこと", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, { edges: [] });

      debounced();
      vi.advanceTimersByTime(100);

      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe("debounceMs: 0", () => {
    it("タイマー発火時に実行されること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 0);

      debounced("zero");
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(0);
      expect(fn).toHaveBeenCalledExactlyOnceWith("zero");
    });

    it("leading モードで即座に実行されクールダウン後に再実行できること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 0, { edges: ["leading"] });

      debounced("a");
      expect(fn).toHaveBeenCalledTimes(1);

      // クールダウン中は無視
      debounced("b");
      expect(fn).toHaveBeenCalledTimes(1);

      // 0ms タイマー発火でクールダウン完了
      vi.advanceTimersByTime(0);

      debounced("c");
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(2, "c");
    });

    it("leading+trailing モードで両方実行されること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 0, { edges: ["leading", "trailing"] });

      debounced("a");
      debounced("b");
      expect(fn).toHaveBeenCalledExactlyOnceWith("a");

      vi.advanceTimersByTime(0);
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(2, "b");
    });
  });

  describe("再帰呼び出し", () => {
    it("trailing コールバック内から再帰呼び出しした引数が失われないこと", () => {
      const calls: string[] = [];
      const debounced = debounce((x: string) => {
        calls.push(x);
        if (x === "a") {
          debounced("re-entry");
        }
      }, 100);

      debounced("a");
      vi.advanceTimersByTime(100);
      expect(calls).toStrictEqual(["a"]);

      // "re-entry" の trailing が発火するべき
      vi.advanceTimersByTime(100);
      expect(calls).toStrictEqual(["a", "re-entry"]);
    });

    it("leading+trailing コールバック内から再帰呼び出しした引数が trailing で実行されること", () => {
      const calls: string[] = [];
      const debounced = debounce(
        (x: string) => {
          calls.push(x);
          if (x === "a") {
            debounced("re-entry");
          }
        },
        100,
        { edges: ["leading", "trailing"] },
      );

      debounced("a");
      expect(calls).toStrictEqual(["a"]);

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

    it("leading モードでコールバックが例外を投げても次のサイクルが動作すること", () => {
      const fn = vi.fn().mockImplementationOnce(() => {
        throw new Error("boom");
      });
      const debounced = debounce(fn, 100, { edges: ["leading"] });

      expect(() => {
        debounced("a");
      }).toThrow("boom");

      vi.advanceTimersByTime(100);
      debounced("b");
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(2, "b");
    });

    it("flush 中にコールバックが例外を投げても isLeadingInvoked がリセットされること", () => {
      const fn = vi
        .fn()
        .mockImplementationOnce(() => {
          // leading: 正常
        })
        .mockImplementationOnce(() => {
          throw new Error("boom");
        });
      const debounced = debounce(fn, 100, { edges: ["leading", "trailing"] });

      debounced("a");
      debounced("b");
      expect(fn).toHaveBeenCalledTimes(1);

      // flush の invoke で例外
      expect(() => {
        debounced.flush();
      }).toThrow("boom");

      // flush 内の例外後も isLeadingInvoked がリセットされ、新しいサイクルで leading が発火する
      debounced("c");
      expect(fn).toHaveBeenCalledTimes(3);
      expect(fn).toHaveBeenNthCalledWith(3, "c");
    });

    it("タイマーコールバック中にコールバックが例外を投げても isLeadingInvoked がリセットされること", () => {
      const fn = vi
        .fn()
        .mockImplementationOnce(() => {
          // leading: 正常
        })
        .mockImplementationOnce(() => {
          throw new Error("boom");
        });
      const debounced = debounce(fn, 100, {
        edges: ["leading", "trailing"],
      });

      debounced("a");
      debounced("b");
      expect(fn).toHaveBeenCalledTimes(1);

      // trailing の invoke で例外
      expect(() => {
        vi.advanceTimersByTime(100);
      }).toThrow("boom");

      // タイマーコールバック中の例外後も isLeadingInvoked がリセットされている
      debounced("c");
      expect(fn).toHaveBeenCalledTimes(3);
      expect(fn).toHaveBeenNthCalledWith(3, "c");
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

    it("leading モードで cancel 後に再び leading が発火すること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, { edges: ["leading"] });

      debounced("a");
      expect(fn).toHaveBeenCalledTimes(1);

      debounced.cancel();

      debounced("b");
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(2, "b");
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

    it("保留中でない場合に flush しても何も起きないこと", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced.flush();
      expect(fn).not.toHaveBeenCalled();
    });

    it("flush を2回連続で呼んでも1回しか実行されないこと", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced("data");
      debounced.flush();
      debounced.flush();

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("cancel 後に flush しても何も起きないこと", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced("data");
      debounced.cancel();
      debounced.flush();

      expect(fn).not.toHaveBeenCalled();
    });

    it("cancel 後に schedule → flush しても実行されないこと", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced("stale");
      debounced.cancel();

      // cancel が lastArgs をクリアしていなければ、
      // schedule → flush で stale な引数で実行されてしまう
      debounced.schedule();
      debounced.flush();

      expect(fn).not.toHaveBeenCalled();
    });

    it("flush 後に cancel しても安全であること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced("data");
      debounced.flush();
      expect(fn).toHaveBeenCalledTimes(1);

      expect(() => {
        debounced.cancel();
      }).not.toThrow();
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("サイクル完了後に flush しても何も起きないこと", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced("data");
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);

      debounced.flush();
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
  });

  describe("schedule", () => {
    it("前回の引数でタイマーを再スケジュールすること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      // 50ms 経過 → schedule でタイマー再スケジュール → 追加 50ms ではまだ発火しない
      debounced("args");
      vi.advanceTimersByTime(50);
      debounced.schedule();
      vi.advanceTimersByTime(50);
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      expect(fn).toHaveBeenCalledExactlyOnceWith("args");
    });

    it("一度も呼び出さずに schedule しても何も実行されないこと", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced.schedule();
      vi.advanceTimersByTime(100);

      expect(fn).not.toHaveBeenCalled();
    });

    it("flush 後に schedule しても何も実行されないこと", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced("data");
      debounced.flush();
      expect(fn).toHaveBeenCalledTimes(1);

      // flush が lastArgs をクリアしているので schedule → タイマー発火しても no-op
      debounced.schedule();
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("cancel 後に schedule しても何も実行されないこと", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced("data");
      debounced.cancel();

      debounced.schedule();
      vi.advanceTimersByTime(100);

      expect(fn).not.toHaveBeenCalled();
    });

    it("サイクル完了後に schedule しても何も実行されないこと", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced("data");
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);

      // タイマー自然完了後は lastArgs が undefined なので schedule → 発火しても no-op
      debounced.schedule();
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("schedule を連続で呼ぶと毎回タイマーがリセットされること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      // 50ms 刻みで schedule を繰り返すたびに 100ms タイマーが毎回リセットされる
      debounced("args");
      vi.advanceTimersByTime(50);
      debounced.schedule();
      vi.advanceTimersByTime(50);
      debounced.schedule();
      vi.advanceTimersByTime(50);
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      expect(fn).toHaveBeenCalledExactlyOnceWith("args");
    });

    it("leading モードで schedule するとクールダウンが延長されること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, { edges: ["leading"] });

      // t=0: leading 発火、タイマー → t=100
      debounced("a");
      expect(fn).toHaveBeenCalledTimes(1);

      // t=80: schedule でタイマーリセット → t=180
      vi.advanceTimersByTime(80);
      debounced.schedule();

      // t=180: リスケジュール分の100ms経過 → クールダウン完了
      vi.advanceTimersByTime(100);
      debounced("b");
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(2, "b");
    });
  });

  describe("signal", () => {
    it("AbortSignal で保留中の実行がキャンセルされること", () => {
      const fn = vi.fn();
      const controller = new AbortController();
      const debounced = debounce(fn, 100, { signal: controller.signal });

      debounced();
      controller.abort();
      vi.advanceTimersByTime(100);

      expect(fn).not.toHaveBeenCalled();
    });

    it("abort 後は呼び出しが無視されること", () => {
      const fn = vi.fn();
      const controller = new AbortController();
      const debounced = debounce(fn, 100, {
        signal: controller.signal,
        edges: ["leading"],
      });

      debounced();
      expect(fn).toHaveBeenCalledTimes(1);

      controller.abort();

      debounced();
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it.for<{ name: "schedule" | "flush" | "cancel" }>([
      { name: "schedule" },
      { name: "flush" },
      { name: "cancel" },
    ])(
      "abort 後に $name を呼んでも実行されず例外も投げないこと",
      ({ name }) => {
        const fn = vi.fn();
        const controller = new AbortController();
        const debounced = debounce(fn, 100, { signal: controller.signal });

        debounced("data");
        controller.abort();

        expect(() => {
          debounced[name]();
        }).not.toThrow();
        vi.advanceTimersByTime(100);
        expect(fn).not.toHaveBeenCalled();
      },
    );

    it("既に abort 済みの signal を渡すと最初から無効であること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, {
        signal: AbortSignal.abort(),
      });

      debounced();
      vi.advanceTimersByTime(100);

      expect(fn).not.toHaveBeenCalled();
    });

    it("既に abort 済みの signal + leading でも無効であること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100, {
        signal: AbortSignal.abort(),
        edges: ["leading"],
      });

      debounced();
      expect(fn).not.toHaveBeenCalled();
    });

    it("leading+trailing で leading 発火後に abort すると trailing が発火しないこと", () => {
      const fn = vi.fn();
      const controller = new AbortController();
      const debounced = debounce(fn, 100, {
        signal: controller.signal,
        edges: ["leading", "trailing"],
      });

      debounced("a");
      debounced("b");
      expect(fn).toHaveBeenCalledTimes(1);

      controller.abort();
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe("バリデーション", () => {
    it("debounceMs が負数だと TypeError を投げること", () => {
      expect(() => debounce(() => {}, -1)).toThrow(TypeError);
    });

    it("debounceMs が NaN だと TypeError を投げること", () => {
      expect(() => debounce(() => {}, Number.NaN)).toThrow(TypeError);
    });

    it("debounceMs が Infinity だと TypeError を投げること", () => {
      expect(() => debounce(() => {}, Number.POSITIVE_INFINITY)).toThrow(
        TypeError,
      );
    });

    it("maxWait が負数だと TypeError を投げること", () => {
      expect(() => debounce(() => {}, 100, { maxWait: -1 })).toThrow(TypeError);
    });

    it("maxWait が NaN だと TypeError を投げること", () => {
      expect(() => debounce(() => {}, 100, { maxWait: Number.NaN })).toThrow(
        TypeError,
      );
    });
  });

  describe("maxWait", () => {
    it("maxWait 指定時、連続呼び出し中でも maxWait を超えた時点で発火すること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 50, { maxWait: 200 });

      // 30ms 間隔で連続呼び出し (通常の debounce なら永遠に発火しない)
      debounced("x");
      for (let i = 0; i < 7; i += 1) {
        vi.advanceTimersByTime(30);
        debounced("x");
      }
      // t=210 到達時点で maxWait=200 の境界を超え、t=200 で正確に 1 回発火している
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenLastCalledWith("x");
    });

    it("maxWait 無しだと連続呼び出し中は発火しないこと (maxWait が効いていることを裏側から確認)", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 50);

      debounced();
      for (let i = 0; i < 7; i += 1) {
        vi.advanceTimersByTime(30);
        debounced();
      }
      expect(fn).not.toHaveBeenCalled();
    });

    it("maxWait の発火は最後の引数を使うこと", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 50, { maxWait: 100 });

      debounced("a");
      vi.advanceTimersByTime(30);
      debounced("b");
      vi.advanceTimersByTime(30);
      debounced("c");
      vi.advanceTimersByTime(30);
      debounced("d");
      // t=90 時点、maxWait=100 まで残り 10ms
      vi.advanceTimersByTime(10);
      // t=100 到達で maxWait 発火 → 最新の "d" で実行
      expect(fn).toHaveBeenCalledExactlyOnceWith("d");
    });

    it("maxWait が debounceMs 未満の場合は debounceMs にクランプされること", () => {
      const fn = vi.fn();
      // maxWait(30) < debounceMs(100) → maxWait は 100 にクランプ
      const debounced = debounce(fn, 100, { maxWait: 30 });

      debounced();
      vi.advanceTimersByTime(99);
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("leading-only + maxWait で maxWait 超過時に leading が再発火すること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 50, {
        maxWait: 150,
        edges: ["leading"],
      });

      // t=0: leading で "a" 発火
      debounced("a");
      expect(fn).toHaveBeenCalledExactlyOnceWith("a");

      // 30ms 刻みで 6 回 (計 180ms)。maxWait 超過でタイマーが t=150 に短縮され、
      // そこでタイマーが発火して isLeadingInvoked がリセット → t=150 に呼ばれた x4 で leading 再発火
      for (let i = 0; i < 6; i += 1) {
        vi.advanceTimersByTime(30);
        debounced(`x${i}`);
      }
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenNthCalledWith(2, "x4");
    });

    it("1回呼んだ後に静止すれば、通常の debounce 発火のみで maxWait 発火は起きないこと", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 50, { maxWait: 200 });

      debounced("once");
      vi.advanceTimersByTime(50);
      expect(fn).toHaveBeenCalledExactlyOnceWith("once");

      // 更に時間を進めても追加発火しない
      vi.advanceTimersByTime(500);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("自然発火後に長時間静止してから再呼び出ししても maxWait 強制発火が起きないこと (回帰テスト)", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 50, { maxWait: 100 });

      // 1回目のバースト
      debounced("a");
      vi.advanceTimersByTime(50);
      expect(fn).toHaveBeenCalledExactlyOnceWith("a");

      // 長時間静止 (前回 invoke から 1000ms が経過、maxWait(100) より遥かに大きい)
      vi.advanceTimersByTime(1000);
      expect(fn).toHaveBeenCalledTimes(1);

      // 2回目のバースト: 新規 baseline で通常の debounce(50ms) 後に発火すべき
      debounced("b");
      vi.advanceTimersByTime(49);
      // バグ時: 強制 maxWait で即時発火していた
      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(1);
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenLastCalledWith("b");
    });

    it("cancel で maxWait のベースライン (lastInvokeTime) がリセットされること", () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 50, { maxWait: 100 });

      // 40ms 刻みで呼び出し、通常の trailing (50ms) を先送り
      debounced();
      vi.advanceTimersByTime(40);
      debounced();
      vi.advanceTimersByTime(40);
      // t=80 時点、maxWait=100 の境界手前
      debounced.cancel();
      expect(fn).not.toHaveBeenCalled();

      // cancel 後の新しいバーストでは fresh な maxWait が適用
      debounced("b");
      vi.advanceTimersByTime(49);
      expect(fn).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(fn).toHaveBeenCalledExactlyOnceWith("b");
    });
  });

  describe("this コンテキスト", () => {
    it("メソッド呼び出し時の this が func に伝搬されること", () => {
      const spy = vi.fn();
      const obj = {
        value: 42,
        update: debounce(function update(this: { value: number }, v: number) {
          spy(this.value, v);
        }, 100),
      };

      obj.update(10);
      vi.advanceTimersByTime(100);
      expect(spy).toHaveBeenCalledExactlyOnceWith(42, 10);
    });

    it("leading モードでも this が func に伝搬されること", () => {
      const spy = vi.fn();
      const obj = {
        value: 99,
        update: debounce(
          function update(this: { value: number }, v: number) {
            spy(this.value, v);
          },
          100,
          { edges: ["leading"] },
        ),
      };

      obj.update(7);
      expect(spy).toHaveBeenCalledExactlyOnceWith(99, 7);
    });

    it("Function.prototype.call で渡した this が使われ、最後の this が優先されること", () => {
      const spy = vi.fn();
      const debounced = debounce(function fn(this: { x: number }) {
        spy(this.x);
      }, 100);

      debounced.call({ x: 1 });
      debounced.call({ x: 2 });
      vi.advanceTimersByTime(100);
      expect(spy).toHaveBeenCalledExactlyOnceWith(2);
    });

    it("cancel で保持された this がクリアされ、以降のサイクルに漏れないこと", () => {
      const spy = vi.fn();
      const debounced = debounce(function fn(this: { x: number } | undefined) {
        spy(this?.x);
      }, 100);

      debounced.call({ x: 1 });
      debounced.cancel();

      // 新しいサイクルを別の this で開始
      debounced.call({ x: 2 });
      vi.advanceTimersByTime(100);
      expect(spy).toHaveBeenCalledExactlyOnceWith(2);
    });

    it("再帰呼び出し時に保存した this が失われないこと", () => {
      const spy = vi.fn();
      const obj = {
        value: 1,
        update: debounce(function update(
          this: { value: number },
          step: number,
        ) {
          spy(this.value, step);
          if (step === 1) {
            // trailing 実行中に再帰呼び出し
            obj.update(2);
          }
        }, 100),
      };

      obj.update(1);
      vi.advanceTimersByTime(100);
      expect(spy).toHaveBeenNthCalledWith(1, 1, 1);

      // 再帰で予約された trailing も同じ this で発火すべき
      vi.advanceTimersByTime(100);
      expect(spy).toHaveBeenNthCalledWith(2, 1, 2);
    });
  });
});
