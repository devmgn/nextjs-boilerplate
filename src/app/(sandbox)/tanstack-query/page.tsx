import Link from 'next/link';
import type { NextPage } from 'next';

const Sandbox: NextPage = async () => {
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
};

export default Sandbox;
