import { Spinner } from "@chakra-ui/react";
import { createContext, useContext } from "react";
import { useIntl } from "react-intl";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { selectLocale } from "../../actions/selectLocale";
import { LocaleCode, deviceLocaleToken } from "../../constants";
import { selectDeviceLocale } from "../../selectors/selectDeviceLocale";
import { selectPendingLocale } from "../../selectors/selectPendingLocale";
import { selectSelectedLocale } from "../../selectors/selectSelectedLocale";
import {
  DefaultLocaleDisplayNameOptions,
  LocaleSelect,
  LocaleSelectProps,
} from "../LocaleSelect/LocaleSelect";

export const ActiveLocaleSelectContext = createContext({
  selectPendingLocale,
  selectDeviceLocale,
  selectSelectedLocale,
});

export interface ActiveLocaleSelectProps extends LocaleSelectProps {}

/**
 * Renders a dropdown for selecting the active locale for the application.
 */
export const ActiveLocaleSelect = (props: ActiveLocaleSelectProps) => {
  const { formatMessage, formatDisplayName } = useIntl();
  const dispatch = useAppDispatch();
  const ctx = useContext(ActiveLocaleSelectContext);
  const pendingLocale = useAppSelector((s) => ctx.selectPendingLocale(s));
  const deviceLocale = useAppSelector((s) => ctx.selectDeviceLocale(s));
  const selectedLocale = useAppSelector((s) => ctx.selectSelectedLocale(s));
  const value = pendingLocale || selectedLocale;

  return (
    <LocaleSelect
      {...props}
      placeholder={formatMessage(
        {
          id: "i18n.activeLocaleSelect.deviceLocaleOption",
          defaultMessage: "Default - {locale}",
        },
        {
          locale: formatDisplayName(
            deviceLocale,
            DefaultLocaleDisplayNameOptions,
          ),
        },
      )}
      value={value === deviceLocaleToken ? "" : value}
      onChange={(event) => {
        if (props.onChange) {
          props.onChange(event);
        }

        if (event.isDefaultPrevented()) {
          return;
        }

        dispatch(
          selectLocale((event.target.value as LocaleCode) || deviceLocaleToken),
        );
      }}
      icon={pendingLocale ? <Spinner /> : undefined}
    />
  );
};
