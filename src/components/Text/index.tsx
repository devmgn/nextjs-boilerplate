import { Text as RuiText } from '@radix-ui/themes';
import clsx from 'clsx';
import { text } from './style.css';
import type { TextProps } from '@radix-ui/themes/dist/cjs/components/text';

export const Text: React.FC<TextProps> = ({ className, ...props }) => {
  return <RuiText {...props} className={clsx(className, text)} />;
};
