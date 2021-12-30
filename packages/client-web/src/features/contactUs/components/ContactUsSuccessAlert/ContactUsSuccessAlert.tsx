import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";

export const ContactUsSuccessAlert = () => (
  <Alert
    status="success"
    variant="subtle"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    textAlign="center"
    minH="200px"
  >
    <AlertIcon boxSize="40px" mr={0} />
    <AlertTitle mt={4} mb={1} fontSize="lg">
      <FormattedMessage
        id="app.contactUsSuccess.title"
        defaultMessage="Message sent!"
      />
    </AlertTitle>
    <AlertDescription maxWidth="sm">
      <FormattedMessage
        id="app.contactUsSuccess.message"
        defaultMessage="Thanks for your message. We'll get back to you soon."
      />
    </AlertDescription>
  </Alert>
);
