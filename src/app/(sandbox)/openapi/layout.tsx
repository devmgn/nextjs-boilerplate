/**
 * OpenAPI サンドボックスの見出しを付けるレイアウト。
 *
 * @param props - 配下のページ
 * @returns 見出しと配下のページ
 */
export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <h1 className="text-4xl">OPEN API SANDBOX</h1>
      {children}
    </>
  );
}
