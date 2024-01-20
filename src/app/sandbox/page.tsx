import { TanstackQuerySandbox } from '@/_sandbox/TanstackQuerySandbox';
import type { NextPage } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const Sandbox: NextPage = () => {
  return <TanstackQuerySandbox />;
};

export default Sandbox;
