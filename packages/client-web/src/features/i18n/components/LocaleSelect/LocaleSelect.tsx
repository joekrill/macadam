import { Select, SelectProps } from "@chakra-ui/react";
import { useIntl } from "react-intl";
import { DEFAULT_LOCALE, LOCALES } from "../../constants";
import { getLocaleDisplayName } from "../../getLocaleDisplayName";

export interface LocaleSelectProps extends Omit<SelectProps, "children"> {
  includeDefaultOption?: boolean;
}

/**
 * Renders a dropdown for selecting the active locale for the application.
 */
export const LocaleSelect = ({
  includeDefaultOption,
  ...props
}: LocaleSelectProps) => {
  const { formatDisplayName, formatMessage } = useIntl();
  const placeholder = includeDefaultOption
    ? formatMessage(
        {
          id: "i18n.localeSelect.defaultValue",
          defaultMessage: "Default ({locale})",
        },
        {
          locale: getLocaleDisplayName(DEFAULT_LOCALE),
        }
      )
    : undefined;

  return (
    <Select {...props} placeholder={props.placeholder || placeholder}>
      {LOCALES.map((locale) => (
        <option key={locale} value={locale}>
          {getLocaleDisplayName(locale) ||
            formatDisplayName(locale, {
              type: "language",
              style: "short",
              fallback: "code",
            })}
        </option>
      ))}
    </Select>
  );
};
