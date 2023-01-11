import { VStack } from "@chakra-ui/react";
import { LoginFlow } from "@macadam/api-client";
import {
  SelfServiceUiForm,
  SelfServiceUiFormProps,
} from "../../SelfServiceUi/SelfServiceUiForm";

export interface LoginFormProps {
  flow: LoginFlow;
  isSubmitting: boolean;
  onSubmit: SelfServiceUiFormProps["onSubmit"];
}

export const LoginForm = ({ flow, isSubmitting, onSubmit }: LoginFormProps) => (
  <VStack align="stretch" spacing={5}>
    <SelfServiceUiForm
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      ui={flow.ui}
      flowType="login"
      alignItems="stretch"
    />
  </VStack>
);
