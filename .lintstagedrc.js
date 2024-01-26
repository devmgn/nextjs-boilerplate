const path = require('path');

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`;

module.exports = {
  'src/**/*.[jt]s?(x)': [
    'yarn tsc --incremental false --noEmit',
    buildEslintCommand,
    'yarn test',
  ],
};
