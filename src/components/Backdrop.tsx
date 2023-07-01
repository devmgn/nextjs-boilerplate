'use client';

import styled from 'styled-components';
import createShouldForwardProp from '@/utils/createShouldForwardProp';

const Backdrop = styled.div.withConfig({
  shouldForwardProp: createShouldForwardProp('transparent'),
})`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

Backdrop.defaultProps = {
  className: 'Backdrop',
  'aria-hidden': true,
};

export default Backdrop;
