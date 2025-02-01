import { FaceIcon } from "@radix-ui/react-icons";
import { render } from "@testing-library/react";
import { SvgIcon } from ".";

describe("SvgIcon", () => {
  it("renders correctly", () => {
    const { asFragment } = render(
      <SvgIcon icon={FaceIcon} label="face icon" />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
