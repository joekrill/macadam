import { ComponentProps, ReactNode } from "react";
import { Redirect, Route } from "react-router";
import { useSession } from "../hooks/useSession";

export interface AuthenticatedRouteProps extends ComponentProps<typeof Route> {
  whileLoading?: ReactNode;
  allowUnverified?: boolean;
}

export const AuthenticatedRoute = ({
  allowUnverified = false,
  children,
  whileLoading,
  ...props
}: AuthenticatedRouteProps) => {
  const { isLoggedIn, isUnknown, isVerified } = useSession();

  return (
    <Route
      {...props}
      render={({ location }) => {
        if (isUnknown) {
          return whileLoading;
        }

        if (!allowUnverified && !isVerified) {
          // TODO: Render message about verifying email address to continue?
        }

        if (isLoggedIn) {
          return children;
        }

        return (
          <Redirect
            to={{
              pathname: "/auth/login",
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};
