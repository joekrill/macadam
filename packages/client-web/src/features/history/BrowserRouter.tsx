import { Router, RouterProps } from "react-router";
import { history } from "./history";

export const BrowserRouter = (props: Omit<RouterProps, "history">) => (
  <Router history={history} {...props} />
);
