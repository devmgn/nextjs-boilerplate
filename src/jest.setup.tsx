import '@testing-library/jest-dom/extend-expect';
import 'jest-styled-components';

jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});
