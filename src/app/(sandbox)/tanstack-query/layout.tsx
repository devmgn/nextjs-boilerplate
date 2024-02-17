const TanstackQueryLayout: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <main className="prose prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-ul:list-none prose-ul:p-0 container">
      <h1 className="sm:text-4xl">Tanstack Query Sandbox</h1>
      {children}
    </main>
  );
};

TanstackQueryLayout.displayName = 'TanstackQueryLayout';

export default TanstackQueryLayout;
