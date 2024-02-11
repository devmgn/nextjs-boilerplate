import Link from 'next/link';
import type { NextPage } from 'next';

const Sandbox: NextPage = async () => {
  return (
    <ul>
      <li>
        <Link
          className="text-blue-500 hover:underline"
          href="/tanstack-query/ssr"
        >
          SSR
        </Link>
      </li>
      <li>
        <Link
          className="text-blue-500 hover:underline"
          href="/tanstack-query/csr"
        >
          CSR
        </Link>
      </li>
    </ul>
  );
};

export default Sandbox;
