import { Slot } from '@radix-ui/react-slot';
import clsx from 'clsx';
import { button } from './Button.css';
import type { ButtonVariants } from './Button.css';
import type { SlotProps } from '@radix-ui/react-slot';
import type { Merge } from 'type-fest';

type ButtonProps = Merge<
  { asChild: boolean; disabled?: boolean; variants: ButtonVariants },
  SlotProps
>;

export const Button: React.FC<ButtonProps> = ({
  asChild,
  className,
  disabled,
  variants,
  ...props
}) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      type={asChild ? undefined : 'button'}
      disabled={asChild ? undefined : disabled}
      className={clsx(className, button(variants), disabled && 'disabled')}
      {...props}
    />
  );
};
