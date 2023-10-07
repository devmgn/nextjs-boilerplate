import { Button as RuiButton } from '@radix-ui/themes';
import clsx from 'clsx';
import { button } from './style.css';
import type { ButtonProps } from '@radix-ui/themes/dist/cjs/components/button';

export const Button: React.FC<ButtonProps> = ({ className, ...props }) => {
  return <RuiButton {...props} className={clsx(className, button)} />;
};
