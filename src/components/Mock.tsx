// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker/locale/ja';
import { Box } from '@yamada-ui/react';

export const Mock = () => {
  return <Box>{faker.lorem.paragraph()}</Box>;
};

Mock.displayName = 'Mock';
