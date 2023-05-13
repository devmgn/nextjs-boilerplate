import isPropValid from '@emotion/is-prop-valid';

const createShouldForwardProp =
  (...forwardProps: string[]) =>
  (prop: string) => {
    return isPropValid(prop) && !forwardProps.includes(prop);
  };
export default createShouldForwardProp;
