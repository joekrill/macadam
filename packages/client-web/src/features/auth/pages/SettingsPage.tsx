import { Card } from "../../common/components/Card/Card";
import { useUrlSearchParams } from "../../routing/hooks/useUrlSearchParams";
import { RequireAuthenticated } from "../components/RequireAuthenticated";
import { Settings, SettingsProps } from "../components/settings/Settings";

export interface SettingsPageProps {
  headingTextAlign?: SettingsProps["headingTextAlign"];
}

export const SettingsPage = ({ headingTextAlign }: SettingsPageProps) => {
  const params = useUrlSearchParams();

  return (
    <RequireAuthenticated>
      <Card>
        <Settings
          flowId={params.get("flow") || undefined}
          headingTextAlign={headingTextAlign}
          returnTo={params.get("return_to") || undefined}
        />
      </Card>
    </RequireAuthenticated>
  );
};
