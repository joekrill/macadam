import { skipToken } from "@reduxjs/toolkit/query/react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { selfServiceApi } from "../../app/services/selfService";
import { SelfServiceUi } from "../selfService/components/SelfServiceUi";

export const Settings = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const flowId = params.get("flow");
  const result = selfServiceApi.useGetSettingsFlowQuery(flowId ?? skipToken);
  const error = result.error as any;
  const redirectTo = !flowId
    ? "/self-service/settings/browser"
    : error?.data?.error?.details?.redirect_to;

  useEffect(() => {
    if (redirectTo) {
      window.location.href = redirectTo;
    }
  }, [redirectTo]);

  return (
    <div>
      <h1>Settings</h1>
      {result.data?.ui ? <SelfServiceUi ui={result.data?.ui} /> : null}
    </div>
  );
};
