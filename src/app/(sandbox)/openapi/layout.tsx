export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <h1 className="text-4xl">OPEN API SANDBOX</h1>
      {children}
    </>
  );
}
