import { Select, SelectProps, Spinner } from "@chakra-ui/react";
import { createContext, useContext } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../app/hooks";
import { setLocale } from "../actions/setLocale";
import { Locale, LOCALES } from "../locales";
import { selectCurrentLocale } from "../selectors/selectCurrentLocale";
import { selectPendingLocale } from "../selectors/selectPendingLocale";

export const LocaleSelectContext = createContext({
  selectCurrentLocale,
  selectPendingLocale,
});

export interface LocaleSelectProps extends SelectProps {}

/**
 * Renders a dropdown for selecting the active locale for the application.
 */
export const LocaleSelect = (props: LocaleSelectProps) => {
  const context = useContext(LocaleSelectContext);
  const currentLocale = useSelector((state) =>
    context.selectCurrentLocale(state)
  );
  const pendingLocale = useSelector((state) =>
    context.selectPendingLocale(state)
  );
  const dispatch = useAppDispatch();
  const { formatDisplayName } = useIntl();

  return (
    <Select
      {...props}
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
