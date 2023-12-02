import { chakra } from "@chakra-ui/react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  NotificationBanner,
  NotificationBannerProps,
} from "../../../common/components/NotificationBanner/NotificationBanner";

export interface VerifyEmailNotificationBannerProps
  extends Omit<NotificationBannerProps, "linkTo" | "linkText" | "children"> {
  emailAddress: string;
}

export const VerifyEmailNotificationBanner = ({
  emailAddress,
  ...props
}: VerifyEmailNotificationBannerProps) => {
  const { formatMessage } = useIntl();
  return (
    <NotificationBanner
      linkTo="/account/verify"
      linkText={formatMessage({
        id: "verifyEmailNotificationBanner.resendButton.text",
        description:
          "The text to display on the button used to resend the account verification email.",
        defaultMessage: "Resend email",
      })}
      {...props}
    >
      <FormattedMessage
        id="verifyEmailNotificationBanner.emailSentMessage"
        description="The message displayed in the banner when the user has not yet verified their account's email address."
        defaultMessage="Please confirm your email. We've send a message to <e>{emailAddress}</e>."
        values={{
          emailAddress,
          e: (chunks) => <chakra.strong>{chunks}</chakra.strong>,
        }}
      />
    </NotificationBanner>
  );
};
