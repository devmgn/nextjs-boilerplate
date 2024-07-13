export default function ParallelLayout({
  children,
  list,
  modal,
}: React.PropsWithChildren<{
  list: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <main className="prose container prose-ul:list-none prose-ul:p-0 prose-a:text-blue-600 hover:prose-a:text-blue-500">
      <h1 className="sm:text-4xl">Parallel Layout</h1>
      <div className="">
        {modal}
        {children}
        {list}
      </div>
    </main>
  );
}
