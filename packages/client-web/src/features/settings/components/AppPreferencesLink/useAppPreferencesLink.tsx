import { useIntl } from "react-intl";

export const useAppPreferencesLink = () => {
  const { formatMessage } = useIntl();

  return {
    to: "/settings",
    label: formatMessage({
      id: "settings.appPreferencesLink.label",
      defaultMessage: "Settings",
    }),
  };
};
