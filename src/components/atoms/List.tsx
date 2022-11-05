import styled from 'styled-components';

const StyledList = styled.ul`
  /** empty */
`;

const Item = styled.li`
  /** empty */
`;

type ListProps = React.ComponentProps<typeof StyledList> & {
  items: string[];
};

const List: React.FC<ListProps> = ({ items, ...props }) => {
  return (
    <StyledList {...props}>
      {items.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Item key={index}>{item}</Item>
      ))}
    </StyledList>
  );
};

export default List;
