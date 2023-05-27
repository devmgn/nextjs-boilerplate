import isPropValid from '@emotion/is-prop-valid';

const createShouldForwardProp =
  (...whiteListProps: string[]) =>
  (prop: string) => {
    return isPropValid(prop) && !whiteListProps.includes(prop);
  };

export default createShouldForwardProp;
