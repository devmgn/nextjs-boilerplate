import styled from 'styled-components';

type HeadingProps = {
  $type?: 'pageTitle' | 'sectionTitle';
};

const Heading = styled.h1<HeadingProps>`
  font-size: ${({ $type }) => ($type === 'sectionTitle' ? '20px' : '32px')};
  font-weight: bold;
  line-height: ${({ $type }) => ($type === 'sectionTitle' ? '32px' : '48px')};
  color: #4c4d4d;
`;

export default Heading;
