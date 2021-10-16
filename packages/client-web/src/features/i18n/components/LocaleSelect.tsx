import { Select, Spinner } from "@chakra-ui/react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../app/hooks";
import { setLocale } from "../actions/setLocale";
import { Locale, LOCALES } from "../locales";
import { selectCurrentLocale } from "../selectors/selectCurrentLocale";
import { selectPendingLocale } from "../selectors/selectPendingLocale";

/**
 * Renders a dropdown for selecting the active locale for the application.
 */
export const LocaleSelect = () => {
  const currentLocale = useSelector((state) => selectCurrentLocale(state));
  const pendingLocale = useSelector((state) => selectPendingLocale(state));
  const dispatch = useAppDispatch();
  const { formatDisplayName } = useIntl();

  return (
    <Select
      value={pendingLocale || currentLocale}
      onChange={(event) => dispatch(setLocale(event.target.value as Locale))}
      icon={pendingLocale ? <Spinner /> : undefined}
    >
      {LOCALES.map((locale) => (
        <option key={locale} value={locale}>
          {formatDisplayName(locale, {
            type: "language",
            fallback: "code",
          })}
        </option>
      ))}
    </Select>
  );
};
