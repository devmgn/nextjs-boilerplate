/**
 * レンダリング中に throw して ErrorBoundary の捕捉を実演するためのコンポーネント。
 *
 * 呼び出し側は throw を書かずに済み、
 * `{shouldError && <ErrorThrower />}` と JSX 上で状態を表現できる。
 */
// throw のみ（戻り値 never）で JSX を返さないため sonarjs が関数名とみなす
// oxlint-disable-next-line sonarjs/function-name
export function ErrorThrower(): never {
  throw new Error("This is a test error to demonstrate ErrorBoundary!");
}
