/**
 * Layout that wraps sandbox pages in a centered main element.
 *
 * @param props - The nested page
 * @returns A main element wrapping the nested page
 */
export default function Layout(props: React.PropsWithChildren) {
  const { children } = props;

  return <main className="mx-auto max-w-[1000px] px-2 py-5">{children}</main>;
}
