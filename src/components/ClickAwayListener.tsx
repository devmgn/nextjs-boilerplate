'use client';

import { cloneElement, isValidElement, useRef } from 'react';
import { useClickAway } from 'react-use';

type ClickAwayListenerProps = React.PropsWithChildren<{
  onClickAway: Parameters<typeof useClickAway>[1];
  events?: Parameters<typeof useClickAway>[2];
}>;

const ClickAwayListener: React.FC<ClickAwayListenerProps> = ({
  onClickAway,
  events,
  children,
}) => {
  const ref = useRef(null);
  useClickAway(ref, onClickAway, events);

  if (!isValidElement(children)) {
    return null;
  }

  return cloneElement(children, { ref, ...children.props });
};

export default ClickAwayListener;
