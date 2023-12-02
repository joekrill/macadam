import { Button, ButtonProps } from "@chakra-ui/react";
import { FaBan } from "react-icons/fa";
import { FormattedMessage } from "react-intl";

export interface CancelButtonProps extends ButtonProps {}

export const CancelButton = ({ children, ...props }: CancelButtonProps) => (
  <Button
    // minWidth={{ base: "full", sm: "xs" }}
    leftIcon={<FaBan />}
    type="button"
    colorScheme="yellow"
    variant="outline"
    {...props}
  >
    {children || (
      <FormattedMessage
        id="forms.cancelButton.text"
        description="The text to show for the 'Cancel' button used by forms across the app when cancelling an action"
        defaultMessage="Cancel"
      />
    )}
  </Button>
);
