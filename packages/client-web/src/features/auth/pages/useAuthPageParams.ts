import { authenticatorAssuranceLevelSchema } from "@macadam/api-client";
import { useMemo } from "react";
import { useUrlSearchParams } from "../../../features/routing/hooks/useUrlSearchParams";

export const useAuthPageParams = () => {
  const params = useUrlSearchParams();
  const aal = useMemo(() => {
    try {
      return authenticatorAssuranceLevelSchema.parse(params.get("aal"));
    } catch (_) {
      return undefined;
    }
  }, [params]);

  return useMemo(
    () => ({
      aal,
      flowId: params.get("flow") || undefined,
      refresh: params.has("refresh"),
      returnTo: params.get("return_to") || undefined,
    }),
    [params, aal],
  );
};
