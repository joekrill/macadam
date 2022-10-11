import {
  Button,
  Collapse,
  Heading,
  Icon,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { SettingsFlow, useNodeGroupNames } from "@macadam/api-client";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { FormattedMessage, useIntl } from "react-intl";
import { Card } from "../../../../common/components/Card/Card";
import {
  SelfServiceUiForm,
  SelfServiceUiFormProps,
} from "../../SelfServiceUi/SelfServiceUiForm";

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
  const { formatMessage } = useIntl();
  const groupNames = useNodeGroupNames(flow.ui.nodes);
  const { isOpen: isTotpOpen, onToggle: onTotpToggle } = useDisclosure();
  const { isOpen: isWebauthnOpen, onToggle: onWebauthnToggle } =
    useDisclosure();

  return (
    <VStack align="stretch" spacing={5}>
      {groupNames.includes("profile") && (
        <Card>
          <Heading as="h3" size="md">
            <FormattedMessage
              id="auth.settingsForm.profileSection.title"
              description="The heading displayed at the top of the profile section of the settings form"
              defaultMessage="Profile"
            />
          </Heading>
          <SelfServiceUiForm
            key="profile"
            ui={flow.ui}
            group="profile"
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
          />
        </Card>
      )}
      {groupNames.includes("password") && (
        <Card>
          <Heading as="h3" size="md">
            <FormattedMessage
              id="auth.settingsForm.changePasswordSection.title"
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
        </Card>
      )}
      {groupNames.includes("oidc") && (
        <Card>
          <Heading as="h3" size="md">
            <FormattedMessage
              id="auth.settings.oidcSection.title"
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
        </Card>
      )}
      {groupNames.includes("totp") && (
        <Card>
          <Button
            aria-label={formatMessage({
              id: "auth.settings.totpSection.toggleButton.ariaLabel",
              defaultMessage: "Toggle Two-factor authentication settings",
            })}
            onClick={onTotpToggle}
            variant="unstyled"
          >
            <Heading as="h3" size="md" display="flex" alignItems="center">
              <Icon mr="3" as={isTotpOpen ? FaMinusCircle : FaPlusCircle} />
              <FormattedMessage
                id="auth.settings.totpSection.title"
                description="The heading displayed at the top of the change password section of the settings form"
                defaultMessage="Two-factor Authentication"
              />
            </Heading>
          </Button>

          <Collapse in={isTotpOpen} animateOpacity>
            <SelfServiceUiForm
              key="totp"
              ui={flow.ui}
              group="totp"
              isSubmitting={isSubmitting}
              onSubmit={onSubmit}
            />
          </Collapse>
        </Card>
      )}

      {groupNames.includes("webauthn") && (
        <Card>
          <Button
            aria-label={formatMessage({
              id: "auth.settings.webauthnSection.toggleButton.ariaLabel",
              defaultMessage: "Toggle Hardware Tokens and Biometrics settings",
            })}
            onClick={onWebauthnToggle}
            variant="unstyled"
          >
            <Heading as="h3" size="md" display="flex" alignItems="center">
              <Icon mr="3" as={isTotpOpen ? FaMinusCircle : FaPlusCircle} />
              <FormattedMessage
                id="auth.settings.webauthnSection.title"
                description="The heading displayed at the top of the change password section of the settings form"
                defaultMessage="Hardware Tokens and Biometrics"
              />
            </Heading>
          </Button>
          <Collapse in={isWebauthnOpen} animateOpacity>
            <SelfServiceUiForm
              key="webauthn"
              ui={flow.ui}
              group="webauthn"
              isSubmitting={isSubmitting}
              onSubmit={onSubmit}
            />
          </Collapse>
        </Card>
      )}
    </VStack>
  );
};
