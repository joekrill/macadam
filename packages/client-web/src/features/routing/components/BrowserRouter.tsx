import { MemoryRouter, Router, RouterProps } from "react-router-dom";
import { history } from "../history";

export const BrowserRouter = (props: Omit<RouterProps, "history">) =>
  process.env.NODE_ENV === "test" ? (
    <MemoryRouter {...props} />
  ) : (
    <Router history={history} {...props} />
  );
