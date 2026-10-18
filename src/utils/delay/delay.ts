/**
 * Waits for the given number of milliseconds.
 *
 * @param ms - Milliseconds to wait.
 */
export async function delay(ms: number): Promise<void> {
  const { promise, resolve } = Promise.withResolvers<undefined>();
  setTimeout(resolve, ms);
  await promise;
}
