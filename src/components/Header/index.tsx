import { Slot } from '@radix-ui/react-slot';
import clsx from 'clsx';
import { header } from './Header.css';
import type { SlotProps } from '@radix-ui/react-slot';

export const Header: React.FC<SlotProps> = ({ className, ...props }) => {
  return (
    <Slot {...props} className={clsx(header, className)}>
      <header>header</header>
    </Slot>
  );
};
