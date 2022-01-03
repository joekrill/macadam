import { Navigate, useLocation } from "react-router-dom";
import { useSession } from "../hooks/useSession";
import { useLoginLink } from "./LoginLink/useLoginLink";

// TODO: `children` and `whileLoading` should be typed as `ReactNode` types,
// but this causes a conflict with incorrect `element` typings in React Router.
// So until that is fixed, they are typed as JSX.Element (and children is required).

export interface RequireAuthenticatedProps {
  children: JSX.Element;
  whileLoading?: JSX.Element;
  allowUnverified?: boolean;
}

export const RequireAuthenticated = ({
  allowUnverified = false,
  children,
  whileLoading,
}: RequireAuthenticatedProps) => {
  const { isLoggedIn, isUnknown, isVerified } = useSession();
  const { to } = useLoginLink();
  const location = useLocation();

  if (isUnknown) {
    return whileLoading || <span />;
  }

  if (!isLoggedIn) {
    return <Navigate replace to={to} state={{ returnTo: location.pathname }} />;
  }

  if (!allowUnverified && !isVerified) {
    // TODO: Render message about verifying email address to continue?
  }

  return children;
};
