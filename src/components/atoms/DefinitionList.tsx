import styled from 'styled-components';

const StyledDefinitionList = styled.dl`
  /** empty */
`;

const Item = styled.div`
  display: flex;
`;

const Term = styled.dt`
  flex-shrink: 0;
  width: 185px;
  padding-right: 10px;
`;

const Description = styled.dd`
  flex-grow: 1;
`;

type DefinitionListProps = React.ComponentProps<typeof StyledDefinitionList> & {
  items: {
    term: string;
    description: string;
  }[];
};

const DefinitionList: React.FC<DefinitionListProps> = ({ items, ...props }) => {
  return (
    <StyledDefinitionList {...props}>
      {items.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Item key={index}>
          <Term>{item.term}</Term>
          <Description>{item.description}</Description>
        </Item>
      ))}
    </StyledDefinitionList>
  );
};

export default DefinitionList;
