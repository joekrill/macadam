import { render, screen } from "../test-utils";
import { App } from "./App";

xtest("renders the home page", () => {
  render(<App />);
  const linkElement = screen.getByText(
    /Opinionated, production-ready, full-featured SaaS boilerplate./i
  );
  expect(linkElement).toBeInTheDocument();
});
