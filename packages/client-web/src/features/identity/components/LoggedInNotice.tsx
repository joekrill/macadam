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
import { FaHome, FaSignOutAlt } from "react-icons/fa";
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
        Already Logged In
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        You're already logged in{" "}
        {username && (
          <chakra.span>
            as <chakra.strong>{username}</chakra.strong>
          </chakra.span>
        )}
        .
        <ButtonGroup colorScheme="blue" variant="outline" spacing={4} mt={6}>
          <Button
            as={RouterLink}
            variant="solid"
            to="/"
            leftIcon={<Icon as={FaHome} />}
          >
            Go to home page
          </Button>
          <LogoutButton
            rightIcon={<Icon as={FaSignOutAlt} />}
            colorScheme="blue"
            variant="outline"
            onLogoutComplete={onLogout}
          >
            Sign Out
          </LogoutButton>
        </ButtonGroup>
      </AlertDescription>
    </Card>
  );
};
