import '@testing-library/jest-dom/extend-expect';
import 'jest-styled-components';
import appSettings from '../appSettings.json';

jest.mock('appSettings', () => appSettings, { virtual: true });
