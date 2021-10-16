import { ReactNode, useEffect } from "react";
import { IntlProvider } from "react-intl";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../app/hooks";
import { initialize } from "../actions/initialize";
import { DEFAULT_LOCALE, getMessages } from "../locales";
import { selectCurrentLocale } from "../selectors/selectCurrentLocale";
import { LocaleErrorNotifier } from "./LocaleErrorNotifier";

export interface I18nProviderProps {
  children?: ReactNode | undefined;
}

export const I18nProvider = ({ children }: I18nProviderProps) => {
  const currentLocale = useSelector((state) => selectCurrentLocale(state));
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initialize());
  }, [dispatch]);

  return (
    <IntlProvider
      locale={currentLocale}
      messages={getMessages(currentLocale)}
      defaultLocale={DEFAULT_LOCALE}
    >
      <LocaleErrorNotifier>{children}</LocaleErrorNotifier>
    </IntlProvider>
  );
};
