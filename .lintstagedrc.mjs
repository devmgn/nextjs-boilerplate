import { relative } from "path";

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => relative(process.cwd(), f))
    .join(" --file ")}`;

export default {
  "src/**/*.[jt]s?(x)": ['bash -c "yarn tsc"', "yarn test"],
};
