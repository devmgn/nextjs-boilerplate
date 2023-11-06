import { Slot } from '@radix-ui/react-slot';
import type { SlotProps } from '@radix-ui/react-slot';

export const Footer: React.FC<SlotProps> = (props) => {
  return (
    <Slot {...props}>
      <footer>header</footer>
    </Slot>
  );
};
