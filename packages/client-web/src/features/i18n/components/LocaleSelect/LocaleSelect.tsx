import { Select, SelectProps } from "@chakra-ui/react";
import { FormatDisplayNameOptions, useIntl } from "react-intl";
import { LOCALES } from "../../constants";

export const DefaultLocaleDisplayNameOptions: FormatDisplayNameOptions = {
  type: "language",
  style: "long",
  fallback: "code",
  languageDisplay: "standard",
};

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
          {formatDisplayName(locale, DefaultLocaleDisplayNameOptions)}
        </option>
      ))}
    </Select>
  );
};
