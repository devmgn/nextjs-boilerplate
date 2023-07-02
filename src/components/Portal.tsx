'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { WithChildrenProps } from '@/types';

const Portal: React.FC<WithChildrenProps> = ({ children }) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setContainer(document.body);
    return () => setContainer(null);
  }, []);

  return container ? createPortal(children, container) : null;
};

export default Portal;
