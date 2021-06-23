import { render, screen } from "../test-utils";
import { App } from "./App";

test("renders the home page", () => {
  render(<App />);
  const linkElement = screen.getByText(/A short tagline about/i);
  expect(linkElement).toBeInTheDocument();
});
