import { PropsWithChildren, ReactNode } from "react";
import { useSession } from "../hooks/useSession";

// TODO: `children` and `whileLoading` should be typed as `ReactNode` types,
// but this causes a conflict with incorrect `element` typings in React Router.
// So until that is fixed, they are typed as JSX.Element (and children is required).

export type IfAuthenticatedProps = PropsWithChildren<{
  otherwise?: ReactNode;
}>;

export const IfAuthenticated = ({
  children,
  otherwise,
}: IfAuthenticatedProps) => (
  <>{useSession().isLoggedIn ? children : otherwise}</>
);
