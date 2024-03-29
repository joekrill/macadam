/* eslint-disable no-fallthrough */
import { UiNodeInput } from "@macadam/api-client";
import { useIntl } from "react-intl";

/**
 * Determines the label to use for a given node.
 * This allows us to override specific field labels and localize them.
 */
export const useNodeLabel = (node: UiNodeInput) => {
  const { formatMessage } = useIntl();

  switch (node.attributes.name) {
    case "password": {
      return formatMessage({
        id: "auth.selfServiceUi.passwordNode.label",
        description: "The label for the passowrd input shown in forms.",
        defaultMessage: "Password",
      });
    }
    // The "recovery" flow doesn't provide a label for email, for some reason.
    case "email":
    // For "password_identifier" kratos uses  a generic "ID" label. We have
    // kratos configured to always use an email address as an ID so it's
    // better to show that label here instead.
    case "password_identifier":
    // `password_identifier` was renamed to `identifier` in v0.9
    case "identifier": {
      return formatMessage({
        id: "auth.selfServiceUi.emailNode.label",
        description:
          "The label for the email input on the user profile or registration page.",
        defaultMessage: "E-Mail",
      });
    }
    default: {
      return (
        node.meta?.label?.text ||
        node.attributes.label?.text ||
        node.attributes.name
      );
    }
  }
};
