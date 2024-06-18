export default function ParallelLayout({
  children,
  sidebar,
  list,
}: React.PropsWithChildren<{
  sidebar: React.ReactNode;
  list: React.ReactNode;
}>) {
  return (
    <main className="container prose prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-ul:list-none prose-ul:p-0">
      <h1 className="sm:text-4xl">Parallel Layout</h1>
      <div className="">
        {sidebar}
        {list}
        {children}
      </div>
    </main>
  );
}
