import { ReactNode, useEffect } from "react";
import { IntlProvider } from "react-intl";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { initializeLocalization } from "../../actions/initializeLocalization";
import { DEFAULT_LOCALE } from "../../constants";
import { getMessages } from "../../messages";
import { selectActiveLocale } from "../../selectors/selectActiveLocale";
import { LocaleErrorNotifier } from "../LocaleErrorNotifier/LocaleErrorNotifier";

export interface I18nProviderProps {
  children?: ReactNode | undefined;
}

export const I18nProvider = ({ children }: I18nProviderProps) => {
  const activeLocale = useAppSelector((state) => selectActiveLocale(state));
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeLocalization());
  }, [dispatch]);

  return (
    <IntlProvider
      locale={activeLocale}
      messages={getMessages(activeLocale)}
      defaultLocale={DEFAULT_LOCALE}
    >
      <LocaleErrorNotifier>{children}</LocaleErrorNotifier>
    </IntlProvider>
  );
};
