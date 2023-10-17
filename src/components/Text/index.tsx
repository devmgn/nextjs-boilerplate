import { Text as RaText } from '@radix-ui/themes';
import clsx from 'clsx';
import { colorVariant } from '@/config';
import { text } from './Text.css';
import type { Theme } from '@/types';
import type { TextProps as RaTextProps } from '@radix-ui/themes/dist/cjs/components/text';
import type { OverrideProperties } from 'type-fest';

type TextProps = OverrideProperties<
  RaTextProps,
  {
    color?: Theme['color'];
  }
>;

export const Text: React.FC<TextProps> = ({
  className,
  color = 'text',
  weight = 'regular',
  ...props
}) => {
  return (
    <RaText
      {...props}
      weight={weight}
      className={clsx(text, className, colorVariant[color])}
    />
  );
};
