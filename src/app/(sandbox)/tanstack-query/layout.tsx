const TanstackQueryLayout: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="mb-4 text-3xl font-bold">Tanstack Query Sandbox</h1>
      {children}
    </main>
  );
};

TanstackQueryLayout.displayName = 'TanstackQueryLayout';

export default TanstackQueryLayout;
