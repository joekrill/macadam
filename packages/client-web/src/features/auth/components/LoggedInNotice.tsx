import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertProps,
  AlertTitle,
  Button,
  ButtonGroup,
  chakra,
  Icon,
} from "@chakra-ui/react";
import { ReactElement } from "react";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import { FormattedMessage } from "react-intl";
import { Link as RouterLink } from "react-router-dom";
import { Card } from "../../common/components/Card/Card";
import { useSession } from "../hooks/useSession";
import { LogoutButton } from "./LogoutButton";

export interface LoggedInNoticeProps extends AlertProps {
  onLogout?: () => void;
}

export const LoggedInNotice = ({ onLogout, ...props }: LoggedInNoticeProps) => {
  const { username } = useSession();

  return (
    <Card
      as={Alert}
      status="info"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      {...props}
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        <FormattedMessage
          id="auth.loggedInNotice.heading"
          defaultMessage="Already Logged In"
        />
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        {username ? (
          <FormattedMessage
            id="auth.loggedInNotice.messageWithUsername"
            description="The message telling the user that they are already logged in when their username is available"
            defaultMessage="You're already logged in as <e>{username}</e>."
            values={{
              username,
              e: (chunks: ReactElement) => (
                <chakra.strong>{chunks}</chakra.strong>
              ),
            }}
          />
        ) : (
          <FormattedMessage
            id="auth.loggedInNotice.messageWithoutUsername"
            description="The message telling the user that they are already logged in when their username is not available"
            defaultMessage="You're already logged in."
          />
        )}
        <ButtonGroup colorScheme="blue" variant="outline" spacing={4} mt={6}>
          <Button
            as={RouterLink}
            variant="solid"
            to="/"
            leftIcon={<Icon as={FaHome} />}
          >
            <FormattedMessage
              id="auth.loggedInNotice.goToHomepageButton"
              defaultMessage="Go to the homepage"
            />
          </Button>
          <LogoutButton
            rightIcon={<Icon as={FaSignOutAlt} />}
            colorScheme="blue"
            variant="outline"
            onLogoutComplete={onLogout}
          />
        </ButtonGroup>
      </AlertDescription>
    </Card>
  );
};
