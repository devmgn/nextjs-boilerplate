import { Close } from "@/assets/icons";
import { render } from "@testing-library/react";
import { SvgIcon } from ".";

describe("SvgIcon", () => {
  test("renders correctly", () => {
    const { asFragment } = render(<SvgIcon component={Close} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
