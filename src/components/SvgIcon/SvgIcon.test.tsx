import { render } from "@testing-library/react";
import { SvgIcon } from ".";
import { Close } from "../../assets/icons";

describe("SvgIcon", () => {
  it("renders correctly", () => {
    const { asFragment } = render(<SvgIcon component={Close} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
