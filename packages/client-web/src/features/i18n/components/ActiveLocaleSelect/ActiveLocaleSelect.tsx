import { Spinner } from "@chakra-ui/react";
import { createContext, useContext } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../../app/hooks";
import { selectLocale } from "../../actions/selectLocale";
import { deviceLocaleToken, LocaleCode } from "../../constants";
import { getLocaleDisplayName } from "../../getLocaleDisplayName";
import { selectDeviceLocale } from "../../selectors/selectDeviceLocale";
import { selectPendingLocale } from "../../selectors/selectPendingLocale";
import { selectSelectedLocale } from "../../selectors/selectSelectedLocale";
import { LocaleSelect, LocaleSelectProps } from "../LocaleSelect/LocaleSelect";

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
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const ctx = useContext(ActiveLocaleSelectContext);
  const pendingLocale = useSelector((s) => ctx.selectPendingLocale(s));
  const deviceLocale = useSelector((s) => ctx.selectDeviceLocale(s));
  const selectedLocale = useSelector((s) => ctx.selectSelectedLocale(s));
  const value = pendingLocale || selectedLocale;

  return (
    <LocaleSelect
      {...props}
      placeholder={formatMessage(
        {
          id: "i18n.activeLocaleSelect.deviceLocaleOption",
          defaultMessage: "Auto ({locale})",
        },
        {
          locale: getLocaleDisplayName(deviceLocale),
        }
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
          selectLocale((event.target.value as LocaleCode) || deviceLocaleToken)
        );
      }}
      icon={pendingLocale ? <Spinner /> : undefined}
    />
  );
};
