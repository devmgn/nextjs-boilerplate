'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLifecycles } from 'react-use';

type PortalProps = React.PropsWithChildren<{
  disablePortal?: boolean;
  container?: Parameters<typeof createPortal>[1];
}>;

const Portal: React.FC<PortalProps> = ({
  disablePortal,
  container: _container,
  children,
}) => {
  const [container, setContainer] = useState<PortalProps['container'] | null>(
    null,
  );

  useLifecycles(
    () => setContainer(_container ?? document.body),
    () => setContainer(null),
  );

  if (disablePortal) {
    return children;
  }

  return container ? createPortal(children, container) : null;
};

export default Portal;
