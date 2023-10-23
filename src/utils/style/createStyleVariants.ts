import { styleVariants } from '@vanilla-extract/css';
import type { FlattenObjectWithDottedKeys } from '@/types';
import type { ComplexStyleRule } from '@vanilla-extract/css';

type Tokens = {
  [key: string]: string | Tokens;
};

export const createStyleVariants = <T extends Tokens>(
  themeVars: T,
  cssProperty: keyof React.CSSProperties,
) => {
  type FlattenThemeVars = Record<
    FlattenObjectWithDottedKeys<T>,
    ComplexStyleRule
  >;

  const flattenThemeVars = (vars: T, parentKey = ''): FlattenThemeVars => {
    return Object.entries(vars).reduce((prev, [key, value]) => {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof value === 'string') {
        return { ...prev, [newKey]: { [cssProperty]: value } };
      }
      return { ...prev, ...flattenThemeVars(value as T, newKey) };
    }, {} as FlattenThemeVars);
  };

  return styleVariants(flattenThemeVars(themeVars));
};
