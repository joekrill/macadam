import { Flex, VStack } from "@chakra-ui/react";
import { LoginFlow, useNodeGroupNames } from "@macadam/api-client";
import { FormattedMessage } from "react-intl";
import { DividerWithText } from "../../../../common/components/DividerWithText/DividerWithText";
import {
  SelfServiceUiForm,
  SelfServiceUiFormProps,
} from "../../SelfServiceUi/SelfServiceUiForm";

export interface LoginFormProps {
  flow: LoginFlow;
  isSubmitting: boolean;
  onSubmit: SelfServiceUiFormProps["onSubmit"];
}

export const LoginForm = ({ flow, isSubmitting, onSubmit }: LoginFormProps) => {
  const groupNames = useNodeGroupNames(flow.ui.nodes);

  return (
    <VStack align="stretch" spacing={5}>
      {groupNames.includes("password") && (
        <>
          <SelfServiceUiForm
            key="password"
            group="password"
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            ui={flow.ui}
            flowType="login"
            alignItems="stretch"
          />
        </>
      )}
      {groupNames.includes("oidc") && (
        <Flex direction="column">
          <DividerWithText>
            <FormattedMessage
              id="auth.loginForm.oidcDividerText"
              description="The text displayed in the divider that shows additional login options"
              defaultMessage="or"
            />
          </DividerWithText>
          <SelfServiceUiForm
            key="oidc"
            group="oidc"
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            ui={flow.ui}
            flowType="login"
            alignItems="stretch"
          />
        </Flex>
      )}
    </VStack>
  );
};
