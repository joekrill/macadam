import { useIntl } from "react-intl";

export const useAppPreferencesLink = () => {
  const { formatMessage } = useIntl();

  return {
    to: "/settings",
    text: formatMessage({
      id: "settings.appPreferencesLink.text",
      description: "The text to display in a link to go to the Settings page",
      defaultMessage: "Settings",
    }),
  };
};
