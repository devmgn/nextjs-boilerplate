import NextLink from 'next/link';
import { DiscList, Link, ListItem } from '@yamada-ui/react';
import type { NextPage } from 'next';

const Sandbox: NextPage = async () => {
  return (
    <DiscList>
      <ListItem>
        <Link as={NextLink} href="/tanstack-query/ssr">
          SSR
        </Link>
      </ListItem>
      <ListItem>
        <Link as={NextLink} href="/tanstack-query/csr">
          CSR
        </Link>
      </ListItem>
    </DiscList>
  );
};

export default Sandbox;
