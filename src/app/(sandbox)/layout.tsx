export default function Layout(props: React.PropsWithChildren) {
  const { children } = props;

  return <main className="mx-auto max-w-[1000px] px-2 py-5">{children}</main>;
}
