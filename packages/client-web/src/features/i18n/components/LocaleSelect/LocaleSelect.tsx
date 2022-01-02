import { Select, SelectProps } from "@chakra-ui/react";
import { useIntl } from "react-intl";
import { LOCALES } from "../../constants";
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
  const { formatDisplayName } = useIntl();

  return (
    <Select {...props}>
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
