import type { StyledComponent, StyledComponentProps } from 'styled-components';

export type InferStyledComponentProps<SC> = SC extends StyledComponent<infer C, infer T, infer O, infer A>
  ? StyledComponentProps<C, T, O, A> & {
      as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
      forwardedAs?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
    }
  : never;
