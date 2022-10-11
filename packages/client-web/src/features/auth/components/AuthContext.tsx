import { Ability } from "@casl/ability";
import { selectRules } from "@macadam/api-client";
import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { useAppSelector } from "../../../app/hooks";
import { captureException } from "../../monitoring/capture";

export const AuthContext = createContext<Ability>(new Ability());

export type AuthProviderProps = PropsWithChildren<{}>;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const rules = useAppSelector((state) => selectRules(state));
  const ability = useMemo(() => {
    const ability = new Ability();
    try {
      // @ts-ignore
      ability.update(rules);
    } catch (error) {
      captureException(error);
    }

    return ability;
  }, [rules]);

  return (
    <AuthContext.Provider value={ability}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
