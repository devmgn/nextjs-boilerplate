import { useCallback, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import styled from 'styled-components';

const StyledAccordion = styled.div`
  /** empty */
`;

const ToggleButton = styled.button`
  width: 100%;
`;

const Body = styled(m.div)`
  overflow: hidden;
`;

type AccordionProps = {
  children: React.ReactNode;
};

const Accordion: React.FC<AccordionProps> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);

  const onClick = useCallback(() => {
    setIsActive((prevState) => !prevState);
  }, []);

  return (
    <StyledAccordion>
      <ToggleButton type="button" onClick={onClick}>
        開く
      </ToggleButton>
      <AnimatePresence initial={false}>
        {isActive && (
          <Body
            key="accordion"
            initial="inactive"
            animate="active"
            exit="inactive"
            variants={{
              active: { height: 'auto', opacity: 1 },
              inactive: { height: '0', opacity: 0 },
            }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </Body>
        )}
      </AnimatePresence>
    </StyledAccordion>
  );
};

export default Accordion;
