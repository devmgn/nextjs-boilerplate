import Link from "next/link";

export default function TasnstackQuery() {
  return (
    <ul>
      <li>
        <Link href="/tanstack-query/ssr">SSR</Link>
      </li>
      <li>
        <Link href="/tanstack-query/csr">CSR</Link>
      </li>
    </ul>
  );
}
