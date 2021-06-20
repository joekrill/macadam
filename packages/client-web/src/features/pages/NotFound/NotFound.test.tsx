import { render, screen } from "../../../test-utils";
import { NotFound } from "./NotFound";

test("renders a link to the home page", () => {
  render(<NotFound />);
  const linkElement = screen.getByText(/Go to the homepage/i);
  expect(linkElement).toHaveAttribute("href", "/");
});
