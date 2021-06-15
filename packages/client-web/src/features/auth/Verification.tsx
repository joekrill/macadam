import { useLocation } from "react-router-dom";
import { SelfService } from "../selfService/components/SelfService";
import { SelfServiceUi } from "../selfService/components/SelfServiceUi";

// TODO: Handle verification flow correctly.
export const Verification = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const flowId = params.get("flow");

  return (
    <div>
      <h1>Verification</h1>
      {flowId ? (
        <SelfServiceUi flowId={flowId} flowType="verification" />
      ) : (
        <SelfService flowType="verification" />
      )}
    </div>
  );
};
