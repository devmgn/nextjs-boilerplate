import styled from 'styled-components';
import Arrow from '@/components/atoms/icons/arrow.svg';
import Chevron from '@/components/atoms/icons/chevron.svg';
import Information from '@/components/atoms/icons/information.svg';

type IconProps = {
  $size?: number | string;
  $color?: string;
  $rotate?: string;
};

export const Icon = styled.span<IconProps>`
  > svg {
    width: ${({ $size }) => $size && `${$size}px`};
    height: ${({ $size }) => $size && `${$size}px`};
    fill: ${({ $color }) => $color};
    transform: ${({ $rotate }) => $rotate && `rotate(${$rotate})`};
  }
`;

export const ArrowIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <Arrow />
    </Icon>
  );
};

export const ChevronIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <Chevron />
    </Icon>
  );
};

export const InformationIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <Information />
    </Icon>
  );
};
