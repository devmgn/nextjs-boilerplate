import { cloneElement, isValidElement } from 'react';
import { mergeProps } from '@react-aria/utils';
import { useToggle } from 'react-use';
import TooltipArrow from './TooltipArrow';
import TooltipRoot from './TooltipRoot';
import ClickAwayListener from '../ClickAwayListener';
import Popper from '../Popper';
import type { WithChildrenProps } from '@/types';
import type React from 'react';

type TooltipProps = {
  tooltipContent: React.ReactNode;
} & WithChildrenProps;

const Tooltip: React.FC<TooltipProps> = ({ tooltipContent, children }) => {
  const [open, toggle] = useToggle(false);

  const onClickAway = ({ target }: Event) => {
    if (target instanceof HTMLElement && target.closest('.Popper')) {
      return;
    }
    toggle(false);
  };

  if (!(children && isValidElement(children))) {
    return null;
  }

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <Popper
        popperContent={<TooltipRoot>{tooltipContent}</TooltipRoot>}
        cssTransitionProps={{ in: open }}
        arrowComponent={TooltipArrow}
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 12],
              },
            },
          ],
        }}
      >
        {cloneElement(children, mergeProps(children.props, { onClick: toggle }))}
      </Popper>
    </ClickAwayListener>
  );
};

export default Tooltip;
