import { Ability } from "@casl/ability";
import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { captureException } from "../../monitoring/capture";
import { selectRules } from "../selectors/selectRules";

export const AuthContext = createContext<Ability>(new Ability());

export type AuthProviderProps = PropsWithChildren<{}>;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const rules = useSelector((state) => selectRules(state));
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
