import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { ROOT_CONTAINER_ID } from '@/constants';

type PortalProps = {
  children: React.ReactNode;
};

const Portal: React.FC<PortalProps> = ({ children }) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setContainer(document.getElementById(ROOT_CONTAINER_ID));
    return () => setContainer(null);
  }, []);

  return container ? ReactDOM.createPortal(<>{children}</>, container) : null;
};

export default Portal;
