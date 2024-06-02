export default function TanstackQueryLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <main className="container prose prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-ul:list-none prose-ul:p-0">
      <h1 className="sm:text-4xl">Tanstack Query Sandbox</h1>
      {children}
    </main>
  );
}
