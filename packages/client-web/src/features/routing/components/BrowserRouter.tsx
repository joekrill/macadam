import { History } from "history";
import {
  BrowserRouterProps as DefaultBrowserRouterProps,
  unstable_HistoryRouter as HistoryRouter,
} from "react-router-dom";

export interface BrowserRouterProps
  extends Omit<DefaultBrowserRouterProps, "window"> {
  history: History;
}

/**
 * A customer BrowserRouter implementation that allows us to expose the
 * underlying `history`.
 *
 * React Router v6 removed the abillity to pass in a custom history. We need
 * to access this in order to use Sentry's routerInstrumentation. So this
 * component implements BrowserRouter in a way that lets us access the history
 * object outside of react (or, more specifically, lets us use a history
 * object that isn't created inside the component itself).
 *
 * Original implementation:
 * https://github.com/remix-run/react-router/blob/5730e28a7472e3a1b967d95c5c4cc643c570d5c7/packages/react-router-dom/index.tsx#L133
 *
 * Related Github issue:
 * https://github.com/remix-run/react-router/issues/8264
 */
export const BrowserRouter = ({
  basename,
  children,
  history,
}: BrowserRouterProps) => (
  <HistoryRouter basename={basename} children={children} history={history} />
);
