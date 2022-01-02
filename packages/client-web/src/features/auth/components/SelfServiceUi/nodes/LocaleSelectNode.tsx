import { useIntl } from "react-intl";
import { LocaleSelect } from "../../../../i18n/components/LocaleSelect/LocaleSelect";
import { DEFAULT_LOCALE } from "../../../../i18n/constants";
import { getLocaleDisplayName } from "../../../../i18n/getLocaleDisplayName";
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
      helperText={formatMessage({
        id: "i18n.localeSelect.defaultValue",
        defaultMessage:
          "This will be used for external communications or when we can't automatically detect your locale based on your device settings.",
      })}
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
