import { Subject } from "@casl/ability";
import { PropsWithChildren, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export type AuthCanProps = PropsWithChildren<{
  action: string;
  subject: Subject;
  field?: string;
  otherwise?: ReactNode;
}>;

export const AuthCan = ({
  action,
  subject,
  field,
  children,
  otherwise,
}: AuthCanProps) => (
  <>{useAuth().can(action, subject, field) ? children : otherwise}</>
);
