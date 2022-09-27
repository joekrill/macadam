import { ReactNode } from "react";
import { useIntl } from "react-intl";
import { LocaleSelect } from "../../../../i18n/components/LocaleSelect/LocaleSelect";
import { DEFAULT_LOCALE } from "../../../../i18n/constants";
import { getLocaleDisplayName } from "../../../../i18n/getLocaleDisplayName";
import { AppPreferencesLink } from "../../../../settings/components/AppPreferencesLink/AppPreferencesLink";
import { SelfServiceUiNodeInputProps } from "../SelfServiceUiNodeInput";
import { NodeFormControlWrapper } from "./NodeFormControlWrapper";

export interface LocaleSelectNodeProps extends SelfServiceUiNodeInputProps {}

export const LocaleSelectNode = ({
  flowType,
  isSubmitting,
  node,
  onChange,
  value,
}: LocaleSelectNodeProps) => {
  const { formatMessage } = useIntl();
  const { label, node_type: _, onclick, ...attributes } = node.attributes;

  return (
    <NodeFormControlWrapper
      flowType={flowType}
      isSubmitting={isSubmitting}
      node={node}
      helperText={
        // We only want to show this helper text in the settings form and
        // not during registration.
        flowType === "settings" &&
        formatMessage(
          {
            id: "auth.selfServiceUi.localeSelectNode.usageInfo",
            defaultMessage:
              "This will be used for external communications or when we can't automatically detect your locale based on your device settings. To change the current application language visit the <preferencesLink>preferences page</preferencesLink>.",
          },
          {
            preferencesLink: (parts: ReactNode) => (
              <AppPreferencesLink>{parts}</AppPreferencesLink>
            ),
          }
        )
      }
    >
      <LocaleSelect
        {...attributes}
        borderColor="gray.400"
        onChange={(e) => onChange(e.target.value)}
        isDisabled={attributes.disabled || isSubmitting}
        value={value || ""}
        placeholder={formatMessage(
          {
            id: "auth.selfServiceUi.localeSelectNode.defaultValue",
            defaultMessage: "Default ({locale})",
          },
          {
            locale: getLocaleDisplayName(DEFAULT_LOCALE),
          }
        )}
      />
    </NodeFormControlWrapper>
  );
};
