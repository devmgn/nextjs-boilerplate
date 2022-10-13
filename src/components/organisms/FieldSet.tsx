import Heading from '../atoms/Heading';

type FieldSetProps = {
  title: string;
  children: React.ReactElement;
};

const FieldSet: React.FC<FieldSetProps> = ({ title, children }) => {
  return (
    <fieldset>
      <Heading type="sectionTitle" as="legend">
        {title}
      </Heading>
      {children}
    </fieldset>
  );
};

export default FieldSet;
