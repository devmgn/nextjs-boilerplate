import { defineProperties } from '@vanilla-extract/sprinkles';

const space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  auto: 'auto',
};

const marginProperties = defineProperties({
  properties: {
    margin: space,
    marginTop: space,
    marginRight: space,
    marginBottom: space,
    marginLeft: space,
    marginInline: space,
    marginBlock: space,
  },
  shorthands: {
    m: ['margin'],
    mt: ['marginTop'],
    mr: ['marginRight'],
    mb: ['marginBottom'],
    ml: ['marginLeft'],
    mx: ['marginInline'],
    my: ['marginBlock'],
  },
});

export default marginProperties;
