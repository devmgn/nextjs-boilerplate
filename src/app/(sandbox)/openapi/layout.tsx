/**
 * Layout that adds the OpenAPI sandbox heading.
 *
 * @param props - The nested page
 * @returns The heading and the nested page
 */
export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <h1 className="text-4xl">OPEN API SANDBOX</h1>
      {children}
    </>
  );
}
