const TanstackQueryLayout: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <main className="prose mx-auto max-w-3xl p-4 prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-ul:p-0">
      <h1>Tanstack Query Sandbox</h1>
      {children}
    </main>
  );
};

TanstackQueryLayout.displayName = 'TanstackQueryLayout';

export default TanstackQueryLayout;
