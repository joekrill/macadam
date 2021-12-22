import { useToast } from "@chakra-ui/react";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { selectLastError } from "../selectors/selectLastError";

export const LocaleErrorNotifierContext = createContext({
  selectLastError,
});

export interface LocaleErrorNotifierProps {
  children?: ReactNode | undefined;
}

/**
 * Generates a toast message whenever an error occurs loading a new locale.
 */
export const LocaleErrorNotifier = ({ children }: LocaleErrorNotifierProps) => {
  const context = useContext(LocaleErrorNotifierContext);
  const { formatMessage } = useIntl();
  const toast = useToast();
  const lastError = useSelector((state) => context.selectLastError(state));

  useEffect(() => {
    if (lastError) {
      toast({
        title: formatMessage(
          {
            id: "i18n.localErrorToast.title",
            defaultMessage: "Unable to load locale {locale}",
            description: "The toast message shown when a locale fails to load",
          },
          { locale: lastError.locale }
        ),
        description: lastError.error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [lastError]); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
};
