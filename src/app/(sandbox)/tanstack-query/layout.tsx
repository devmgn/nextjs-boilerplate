export default function TanstackQueryLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <main className="prose container prose-ul:list-none prose-ul:p-0 prose-a:text-blue-600 hover:prose-a:text-blue-500">
      <h1 className="sm:text-4xl">Tanstack Query Sandbox</h1>
      {children}
    </main>
  );
}
