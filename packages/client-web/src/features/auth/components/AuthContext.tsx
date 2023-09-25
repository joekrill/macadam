import { MongoAbility, createMongoAbility } from "@casl/ability";
import { unpackRules } from "@casl/ability/extra";
import { authApi } from "@macadam/api-client";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useRef,
} from "react";
import { captureException } from "../../monitoring/capture";

export const AuthContext = createContext<MongoAbility>(createMongoAbility());

export type AuthProviderProps = PropsWithChildren;

export const AuthProvider = (props: AuthProviderProps) => {
  const permissions = authApi.usePermissionsQuery();
  const abilityRef = useRef(createMongoAbility());

  const ability = useMemo(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      abilityRef.current.update(unpackRules(permissions.data?.data.rules));
    } catch (error) {
      abilityRef.current.update([]);
      captureException(error);
    }

    return abilityRef.current;
  }, [permissions.data?.data.rules]);

  return <AuthContext.Provider value={ability} {...props} />;
};

export const useAuth = () => useContext(AuthContext);
