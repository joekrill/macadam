import { ComponentProps, ReactNode } from "react";
import { Redirect, Route } from "react-router";
import { useWhoamiQuery } from "../identityApi";

export interface AuthenticatedRouteProps extends ComponentProps<typeof Route> {
  whileLoading?: ReactNode;
}

export const AuthenticatedRoute = ({
  children,
  whileLoading,
  ...props
}: AuthenticatedRouteProps) => {
  // TODO: switch useSession or useIsLoggedIn?
  const whoami = useWhoamiQuery();

  return (
    <Route
      {...props}
      render={({ location }) => {
        if (whoami.isLoading) {
          return whileLoading;
        }

        if (whoami.data?.id) {
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
