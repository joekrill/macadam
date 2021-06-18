import { render, screen } from "../test-utils";
import { App } from "./App";

test("renders the home page", () => {
  render(<App />);
  const linkElement = screen.getByText(/This is home!/i);
  expect(linkElement).toBeInTheDocument();
});
