import Link from 'next/link';

export default function Sandbox() {
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
