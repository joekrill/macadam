import { render, screen } from "../../../../test-utils";
import { NotFoundPage } from "./NotFoundPage";

test("renders a link to the home page", () => {
  render(<NotFoundPage />);
  const linkElement = screen.getByText(/Go to the homepage/i);
  expect(linkElement).toHaveAttribute("href", "/");
});
