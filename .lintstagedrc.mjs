import { relative } from 'node:path';

const buildEslintCommand = (filenames) =>
  `biome format ${filenames.map((f) => relative(process.cwd(), f)).join(' ')}`;

export default {
  '*.[jt]s?(x)': ['bash -c "yarn tsc"', buildEslintCommand, 'yarn test'],
};
