'use client';

import { Text as RaText } from '@radix-ui/themes';
import clsx from 'clsx';
import { colorVariant } from '@/config';
import { text } from './Text.css';
import type { TextProps as RaTextProps } from '@radix-ui/themes/dist/cjs/components/text';
import type { Merge } from 'type-fest';

type TextProps = Merge<
  Omit<RaTextProps, 'color'>,
  {
    color?: keyof typeof colorVariant;
  }
>;

export const Text: React.FC<TextProps> = ({
  className,
  as = 'p',
  weight = 'regular',
  color = 'text',
  ...props
}) => {
  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-expect-error */}
      <RaText
        {...props}
        as={as}
        weight={weight}
        className={clsx(className, text, colorVariant[color])}
      />
    </>
  );
};
