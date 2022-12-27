import styled from '@emotion/styled';
import ExampleSvg from '@/assets/example.svg';

type StyledIconProps = {
  size?: number | undefined;
};

export const Icon = styled.i<StyledIconProps>`
  width: ${({ size }) => (size !== undefined ? `${size}px` : '24px')};
  height: ${({ size }) => (size !== undefined ? `${size}px` : '24px')};

  > svg {
    width: inherit;
    height: inherit;
  }
`;

type IconProps = React.ComponentProps<typeof Icon>;

export const ExampleIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <ExampleSvg />
    </Icon>
  );
};
