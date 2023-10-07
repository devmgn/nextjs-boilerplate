import { Text as RuiText } from '@radix-ui/themes';
import clsx from 'clsx';
import { text } from './style.css';
import type { TextProps } from '@radix-ui/themes/dist/cjs/components/text';

export const Text: React.FC<TextProps> = ({
  className,
  weight = 'regular',
  ...props
}) => {
  return (
    <RuiText {...props} weight={weight} className={clsx(text, className)} />
  );
};
