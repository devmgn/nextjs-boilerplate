/**
 * 指定ミリ秒だけ待つ。
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
