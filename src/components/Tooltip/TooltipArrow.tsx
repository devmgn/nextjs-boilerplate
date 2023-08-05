import styled from 'styled-components';

const TooltipArrow = styled.span.attrs({ className: 'TooltipArrow' })`
  display: block;
  width: 8px;
  height: 8px;
  background-color: #ddd;
  &[data-popper-placement='top'] {
    clip-path: polygon(50% 100%, 0 0, 100% 0);
  }
  &[data-popper-placement='bottom'] {
    top: -8px;
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  }
`;

export default TooltipArrow;
