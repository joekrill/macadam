import { Subject } from "@casl/ability";
import { PropsWithChildren, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export type IfAuthorizedProps = PropsWithChildren<{
  action: string;
  subject: Subject;
  field?: string;
  otherwise?: ReactNode;
}>;

export const IfAuthorized = ({
  action,
  subject,
  field,
  children,
  otherwise,
}: IfAuthorizedProps) => (
  <>{useAuth().can(action, subject, field) ? children : otherwise}</>
);
