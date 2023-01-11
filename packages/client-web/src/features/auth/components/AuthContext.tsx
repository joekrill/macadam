import { Ability } from "@casl/ability";
import { authApi } from "@macadam/api-client";
import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { captureException } from "../../monitoring/capture";

export const AuthContext = createContext<Ability>(new Ability());

export type AuthProviderProps = PropsWithChildren<{}>;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const permissions = authApi.usePermissionsQuery();

  const ability = useMemo(() => {
    const ability = new Ability();

    try {
      // @ts-ignore
      ability.update(permissions.data?.data.rules);
    } catch (error) {
      captureException(error);
    }

    return ability;
  }, [permissions.data?.data.rules]);

  return (
    <AuthContext.Provider value={ability}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
