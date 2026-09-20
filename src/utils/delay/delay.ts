/**
 * 指定ミリ秒だけ待つ。
 *
 * `new Promise` を各所に散らさず、待機の意図を 1 箇所に閉じ込めるための共通実装。
 *
 * @param ms - 待機するミリ秒数。
 */
export async function delay(ms: number): Promise<void> {
  const { promise, resolve } = Promise.withResolvers<undefined>();
  setTimeout(() => {
    resolve(undefined);
  }, ms);
  await promise;
}
