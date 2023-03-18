import { SvgIcon } from '@mui/material';
import ExampleSvg from '@/assets/example.svg?inline';
import type { SvgIconProps } from '@mui/material';

// eslint-disable-next-line import/prefer-default-export
export const ExampleIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon component={ExampleSvg} inheritViewBox {...props} />
);
