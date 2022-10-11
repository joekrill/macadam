import { VStack } from "@chakra-ui/react";
import { RegistrationFlow, useNodeGroupNames } from "@macadam/api-client";
import { FormattedMessage } from "react-intl";
import { DividerWithText } from "../../../../common/components/DividerWithText/DividerWithText";
import {
  SelfServiceUiForm,
  SelfServiceUiFormProps,
} from "../../SelfServiceUi/SelfServiceUiForm";

export interface RegistrationFormProps {
  flow: RegistrationFlow;
  isSubmitting: boolean;
  onSubmit: SelfServiceUiFormProps["onSubmit"];
}

export const RegistrationForm = ({
  flow,
  isSubmitting,
  onSubmit,
}: RegistrationFormProps) => {
  const groupNames = useNodeGroupNames(flow.ui.nodes);

  return (
    <VStack align="stretch" spacing={5}>
      {groupNames.includes("password") && (
        <SelfServiceUiForm
          key="password"
          group="password"
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          ui={flow.ui}
          alignItems="stretch"
        />
      )}
      {groupNames.includes("oidc") && (
        <>
          <DividerWithText>
            <FormattedMessage
              id="auth.registrationForm.oidcDividerText"
              description="The text displayed in the divider that shows additional registration options"
              defaultMessage="or"
            />
          </DividerWithText>
          <SelfServiceUiForm
            key="oidc"
            group="oidc"
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            ui={flow.ui}
            alignItems="stretch"
          />
        </>
      )}
    </VStack>
  );
};
