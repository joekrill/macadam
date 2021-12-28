import { chakra } from "@chakra-ui/react";
import { ReactElement } from "react";
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
        id: "auth.VerifyEmailNotificationBanner.resendButton.label",
        defaultMessage: "Resend email",
      })}
      {...props}
    >
      <FormattedMessage
        id="auth.VerifyEmailNotificationBanner.emailSentMessage"
        description="The message asking the user to confirm their email address when an email has been sent"
        defaultMessage="Please confirm your email. We've send a message to <e>{emailAddress}</e>."
        values={{
          emailAddress,
          e: (chunks: ReactElement) => <chakra.strong>{chunks}</chakra.strong>,
        }}
      />
    </NotificationBanner>
  );
};
