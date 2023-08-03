'use client';

import { isValidElement, cloneElement, useRef } from 'react';
import { useClickAway } from 'react-use';
import type { WithChildrenProps } from '@/types';

type ClickAwayListenerProps = {
  onClickAway: Parameters<typeof useClickAway>[1];
  events?: Parameters<typeof useClickAway>[2];
} & WithChildrenProps;

const ClickAwayListener: React.FC<ClickAwayListenerProps> = ({ onClickAway, events, children }) => {
  const ref = useRef(null);
  useClickAway(ref, onClickAway, events);

  if (!(children && isValidElement(children))) {
    return null;
  }

  return cloneElement(children, { ref, ...children.props });
};

export default ClickAwayListener;
