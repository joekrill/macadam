import { Heading, VStack } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { useNodeGroupNames } from "../../hooks/useNodeGroupNames";
import { SettingsFlow } from "../../schemas/flows/settings";
import {
  SelfServiceUiForm,
  SelfServiceUiFormProps,
} from "../SelfServiceUi/SelfServiceUiForm";

export interface SettingsFormProps {
  flow: SettingsFlow;
  isSubmitting: boolean;
  onSubmit: SelfServiceUiFormProps["onSubmit"];
}

export const SettingsForm = ({
  flow,
  isSubmitting,
  onSubmit,
}: SettingsFormProps) => {
  const groupNames = useNodeGroupNames(flow.ui.nodes);

  return (
    <VStack align="stretch" spacing={5}>
      {groupNames.includes("profile") && (
        <SelfServiceUiForm
          key="profile"
          ui={flow.ui}
          group="profile"
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
        />
      )}
      {groupNames.includes("password") && (
        <>
          <Heading as="h3" size="md">
            <FormattedMessage
              id="auth.settings.passwordTitle"
              description="The heading displayed at the top of the change password section of the settings form"
              defaultMessage="Change Password"
            />
          </Heading>
          <SelfServiceUiForm
            key="password"
            ui={flow.ui}
            group="password"
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
          />
        </>
      )}
      {groupNames.includes("oidc") && (
        <>
          <Heading as="h3" size="md">
            <FormattedMessage
              id="auth.settings.oidcTitle"
              description="The heading displayed at the top of the change password section of the settings form"
              defaultMessage="3rd Party Log-in"
            />
          </Heading>
          <SelfServiceUiForm
            key="oidc"
            ui={flow.ui}
            group="oidc"
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
          />
        </>
      )}
      {groupNames.includes("totp") && (
        <>
          <Heading as="h3" size="md">
            <FormattedMessage
              id="auth.settings.totpTitle"
              description="The heading displayed at the top of the change password section of the settings form"
              defaultMessage="Two-factor authentication"
            />
          </Heading>
          <SelfServiceUiForm
            key="totp"
            ui={flow.ui}
            group="totp"
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
          />
        </>
      )}

      {groupNames.includes("webauthn") && (
        <>
          <Heading as="h3" size="md">
            <FormattedMessage
              id="auth.settings.webauthnTitle"
              description="The heading displayed at the top of the change password section of the settings form"
              defaultMessage="Hardware Tokens and Biometrics"
            />
          </Heading>
          <SelfServiceUiForm
            key="webauthn"
            ui={flow.ui}
            group="webauthn"
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
          />
        </>
      )}
    </VStack>
  );
};
