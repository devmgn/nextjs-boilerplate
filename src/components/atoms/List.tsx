import styled from 'styled-components';
import { InferStyledComponentProps } from '@/@types/InferStyledComponentProps';

const StyledList = styled.ul`
  /** empty */
`;

const Item = styled.li`
  /** empty */
`;

type ListProps = InferStyledComponentProps<typeof StyledList> & {
  items: string[];
};

const List: React.FC<ListProps> = ({ items, ...props }) => {
  return (
    <StyledList {...props}>
      {items.map((item, index) => (
        <Item key={index}>{item}</Item>
      ))}
    </StyledList>
  );
};

export default List;
